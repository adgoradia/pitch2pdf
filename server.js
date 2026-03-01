/**
 * pitch2pdf – Backend Server
 * Stack: Node.js + Express + Playwright + pdf-lib
 *
 * Install deps:
 *   npm install express playwright pdf-lib cors
 *   npx playwright install chromium
 *
 * Run:
 *   node server.js
 */

import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Service detection ──────────────────────────────────────────────────────────

const SERVICES = [
  { name: 'pitch',         pattern: /pitch\.com|pitch\.[a-z]+\.com/i },
  { name: 'docsend',       pattern: /docsend\.com/i },
  { name: 'google-slides', pattern: /docs\.google\.com\/presentation/i },
  { name: 'google-drive',  pattern: /drive\.google\.com/i },
  { name: 'canva',         pattern: /canva\.com/i },
];

function detectService(url) {
  return SERVICES.find(s => s.pattern.test(url))?.name ?? 'unknown';
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function screenshotAllSlides(page, service) {
  const screenshots = [];

  if (service === 'pitch') {
    // Navigate through slides using arrow keys or next button
    // First count slides via the slide panel if visible, else iterate until nav fails
    let slideIndex = 0;
    while (true) {
      await page.waitForTimeout(600); // let slide render
      const buf = await page.screenshot({ fullPage: false, type: 'png' });
      screenshots.push(buf);

      // Try clicking the next-slide button; break if not found / at end
      const advanced = await page.evaluate(() => {
        // Pitch uses keyboard navigation; simulate ArrowRight
        const el = document.activeElement;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        return true;
      });

      // Detect if we looped back to slide 1 (Pitch wraps around)
      // Simple heuristic: take two screenshots and compare; stop after 60 slides max
      slideIndex++;
      if (slideIndex >= 60) break;

      // Compare current screenshot with first to detect wrap-around
      if (slideIndex > 1) {
        const cur = (await page.screenshot({ type: 'png' })).toString('base64');
        const first = screenshots[0].toString('base64');
        if (cur === first) break; // wrapped back to start
      }
    }

  } else if (service === 'google-slides') {
    // Use the export URL trick for Google Slides — much more reliable
    const exportUrl = page.url()
      .replace(/\/edit.*$/, '/export/pdf')
      .replace(/\/pub.*$/, '/export/pdf');
    await page.goto(exportUrl, { waitUntil: 'networkidle' });
    const pdfBytes = await page.pdf(); // already a PDF — return raw
    return { rawPdf: pdfBytes };

  } else if (service === 'google-drive') {
    // Drive viewer: switch to export URL
    const fileId = page.url().match(/\/d\/([^/]+)/)?.[1];
    if (fileId) {
      await page.goto(`https://drive.google.com/uc?export=download&id=${fileId}`);
    }
    const pdfBytes = await page.pdf();
    return { rawPdf: pdfBytes };

  } else {
    // Generic fallback: try to paginate via arrow keys
    for (let i = 0; i < 60; i++) {
      await page.waitForTimeout(500);
      screenshots.push(await page.screenshot({ fullPage: false, type: 'png' }));
      const prev = screenshots[screenshots.length - 1].toString('base64');
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(300);
      const cur = (await page.screenshot({ type: 'png' })).toString('base64');
      if (i > 0 && cur === screenshots[0].toString('base64')) break;
      if (i > 0 && cur === prev) break; // no change = last slide
    }
  }

  return { screenshots };
}

async function buildPdf(screenshots, viewport) {
  const pdf = await PDFDocument.create();
  for (const buf of screenshots) {
    const img = await pdf.embedPng(buf);
    const page = pdf.addPage([viewport.width, viewport.height]);
    page.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
  }
  return Buffer.from(await pdf.save());
}

async function loginPitch(page, email, password) {
  await page.goto('https://pitch.com/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });
}

// ── Main convert endpoint ──────────────────────────────────────────────────────

app.post('/convert', async (req, res) => {
  const { url, email, password } = req.body;

  if (!url) return res.status(400).json({ error: 'url is required' });

  let validUrl;
  try { validUrl = new URL(url); } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const service = detectService(url);
  if (service === 'unknown') {
    return res.status(400).json({ error: 'Unsupported service. Supported: Pitch, DocSend, Google Slides, Google Drive, Canva.' });
  }

  const viewport = { width: 1280, height: 720 };
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      locale: 'en-US',
    });

    const page = await context.newPage();

    // Optional login for private presentations
    if (email && password && service === 'pitch') {
      await loginPitch(page, email, password);
    }

    // Load the presentation
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for content to settle
    await page.waitForTimeout(2000);

    // Hide any overlays / cookie banners
    await page.evaluate(() => {
      document.querySelectorAll('[class*="cookie"], [class*="banner"], [class*="overlay"], [id*="cookie"]')
        .forEach(el => el.remove());
    });

    const result = await screenshotAllSlides(page, service);
    await browser.close();
    browser = null;

    let pdfBuffer;
    if (result.rawPdf) {
      pdfBuffer = result.rawPdf;
    } else if (result.screenshots?.length) {
      pdfBuffer = await buildPdf(result.screenshots, viewport);
    } else {
      return res.status(500).json({ error: 'No slides captured.' });
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="presentation.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    return res.send(pdfBuffer);

  } catch (err) {
    console.error('[convert error]', err);
    if (browser) await browser.close().catch(() => {});
    return res.status(500).json({ error: err.message || 'Conversion failed.' });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`pitch2pdf server running on http://localhost:${PORT}`));
