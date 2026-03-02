/**
 * pitch2pdf – Backend Server
 * Stack: Node.js + Express + Playwright + pdf-lib
 *
 * Install:
 *   npm install express playwright pdf-lib cors
 *   npx playwright install --with-deps chromium
 *
 * Run:
 *   node server.js
 */

import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function detectService(url) {
  if (/pitch\.com/i.test(url))                      return 'pitch';
  if (/docsend\.com/i.test(url))                    return 'docsend';
  if (/docs\.google\.com\/presentation/i.test(url)) return 'google-slides';
  if (/drive\.google\.com/i.test(url))              return 'google-drive';
  if (/canva\.com/i.test(url))                      return 'canva';
  return 'unknown';
}

// ── Build PDF from PNG buffers ─────────────────────────────────────────────────

async function buildPdf(screenshots, width, height) {
  const pdf = await PDFDocument.create();
  for (const buf of screenshots) {
    const img = await pdf.embedPng(buf);
    const page = pdf.addPage([width, height]);
    page.drawImage(img, { x: 0, y: 0, width, height });
  }
  return Buffer.from(await pdf.save());
}

// ── Hash a buffer for change detection ────────────────────────────────────────

function simpleHash(buf) {
  let h = 0;
  // Sample every 500th byte for speed
  for (let i = 0; i < buf.length; i += 500) {
    h = (Math.imul(31, h) + buf[i]) | 0;
  }
  return h;
}

// ── Pitch converter ────────────────────────────────────────────────────────────

async function convertPitch(page, url, email, password) {

  // 1. Optional login
  if (email && password) {
    console.log('[pitch] Logging in');
    await page.goto('https://pitch.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 20000 }),
      page.click('button[type="submit"]'),
    ]);
    console.log('[pitch] Login complete');
  }

  // 2. Load the presentation
  console.log('[pitch] Loading', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 });

  // 3. Wait for the slide canvas to appear — Pitch renders into a <canvas> or
  //    a div with role="presentation". We wait up to 20s for either.
  console.log('[pitch] Waiting for slide canvas');
  await Promise.race([
    page.waitForSelector('canvas',                    { timeout: 20000 }),
    page.waitForSelector('[class*="slide"]',          { timeout: 20000 }),
    page.waitForSelector('[class*="Slide"]',          { timeout: 20000 }),
    page.waitForSelector('[role="presentation"]',     { timeout: 20000 }),
  ]).catch(() => console.log('[pitch] Canvas selector timed out — continuing anyway'));

  // 4. Extra settle time for fonts / images
  await sleep(4000);

  // 5. Close any welcome / cookie / share overlay
  await page.evaluate(() => {
    [
      '[class*="cookie"]', '[class*="Cookie"]',
      '[class*="modal"]',  '[class*="Modal"]',
      '[class*="overlay"]','[class*="Overlay"]',
      '[class*="toast"]',  '[class*="Toast"]',
      '[class*="banner"]', '[class*="Banner"]',
      '[class*="dialog"]', '[class*="Dialog"]',
    ].forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
  });

  // 6. Click centre of viewport to give keyboard focus to the slide viewer
  await page.mouse.click(640, 360);
  await sleep(300);

  // 7. Try to read total slide count from Pitch's own counter UI
  //    Pitch shows something like "1 / 8" in a small counter element.
  const totalSlides = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*'));
    for (const el of els) {
      const t = el.childElementCount === 0 ? el.textContent.trim() : '';
      const m = t.match(/^(\d+)\s*\/\s*(\d+)$/);
      if (m) return parseInt(m[2], 10);
    }
    return null;
  });
  console.log('[pitch] Slide count from UI:', totalSlides);

  // 8. Screenshot loop
  const screenshots = [];
  const MAX = totalSlides || 80;
  let consecutiveDupes = 0;
  let prevHash = null;

  // Go to slide 1 first (press Home key)
  await page.keyboard.press('Home');
  await sleep(800);

  for (let i = 0; i < MAX; i++) {
    await sleep(900); // wait for slide transition to settle

    const buf = await page.screenshot({ type: 'png', fullPage: false });
    const hash = simpleHash(buf);

    if (i === 0) {
      screenshots.push(buf);
      prevHash = hash;
      console.log(`[pitch] Captured slide 1`);
    } else {
      if (hash === prevHash) {
        consecutiveDupes++;
        console.log(`[pitch] Duplicate frame (${consecutiveDupes})`);
        // Two consecutive identical frames = we're stuck at the last slide
        if (consecutiveDupes >= 2) {
          console.log('[pitch] End of presentation detected');
          break;
        }
      } else {
        consecutiveDupes = 0;
        screenshots.push(buf);
        prevHash = hash;
        console.log(`[pitch] Captured slide ${screenshots.length}`);
      }
    }

    if (totalSlides && screenshots.length >= totalSlides) {
      console.log('[pitch] Captured all slides');
      break;
    }

    // Advance to next slide
    await page.keyboard.press('ArrowRight');
  }

  console.log(`[pitch] Done — ${screenshots.length} slides`);
  return screenshots;
}

// ── Google Slides converter ────────────────────────────────────────────────────

async function convertGoogleSlides(page, url) {
  const exportUrl = url
    .replace(/\/edit[^]*$/, '/export/pdf')
    .replace(/\/pub[^]*$/, '/export/pdf')
    .replace(/\/preview[^]*$/, '/export/pdf');
  console.log('[google-slides] Export URL:', exportUrl);
  const resp = await page.goto(exportUrl, { waitUntil: 'networkidle', timeout: 40000 });
  return { rawPdf: await resp.body() };
}

// ── Google Drive converter ─────────────────────────────────────────────────────

async function convertGoogleDrive(page, url) {
  const fileId = url.match(/\/d\/([^/?]+)/)?.[1];
  if (!fileId) throw new Error('Could not extract file ID from Google Drive URL');
  const exportUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  console.log('[google-drive] Export URL:', exportUrl);
  const resp = await page.goto(exportUrl, { waitUntil: 'networkidle', timeout: 40000 });
  return { rawPdf: await resp.body() };
}

// ── Generic converter (DocSend, Canva, fallback) ───────────────────────────────

async function convertGeneric(page, url) {
  console.log('[generic] Loading:', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 40000 });
  await sleep(3000);

  const screenshots = [];
  let prevHash = null;
  let dupes = 0;

  for (let i = 0; i < 80; i++) {
    await sleep(700);
    const buf = await page.screenshot({ type: 'png', fullPage: false });
    const hash = simpleHash(buf);

    if (hash === prevHash) {
      dupes++;
      if (dupes >= 2) break;
    } else {
      dupes = 0;
      screenshots.push(buf);
      prevHash = hash;
      console.log(`[generic] Slide ${screenshots.length}`);
    }

    await page.keyboard.press('ArrowRight');
  }

  return screenshots;
}

// ── /convert endpoint ──────────────────────────────────────────────────────────

app.post('/convert', async (req, res) => {
  const { url, email, password } = req.body ?? {};

  if (!url) return res.status(400).json({ error: 'url is required' });
  try { new URL(url); } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const service = detectService(url);
  if (service === 'unknown') {
    return res.status(400).json({
      error: 'Unsupported service. Supported: Pitch, DocSend, Google Slides, Google Drive, Canva.',
    });
  }

  console.log(`\n[convert] service=${service} url=${url}`);

  const W = 1280, H = 720;
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const ctx = await browser.newContext({
      viewport: { width: W, height: H },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      locale: 'en-US',
      deviceScaleFactor: 1,
    });

    // Hide headless signals
    await ctx.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.chrome = { runtime: {} };
    });

    const page = await ctx.newPage();
    page.setDefaultTimeout(40000);

    let result;
    switch (service) {
      case 'pitch':
        result = { screenshots: await convertPitch(page, url, email, password) };
        break;
      case 'google-slides':
        result = await convertGoogleSlides(page, url);
        break;
      case 'google-drive':
        result = await convertGoogleDrive(page, url);
        break;
      default:
        result = { screenshots: await convertGeneric(page, url) };
    }

    await browser.close();
    browser = null;

    let pdfBuf;
    if (result.rawPdf) {
      pdfBuf = Buffer.isBuffer(result.rawPdf) ? result.rawPdf : Buffer.from(result.rawPdf);
    } else if (result.screenshots?.length) {
      pdfBuf = await buildPdf(result.screenshots, W, H);
    } else {
      return res.status(500).json({
        error: 'No slides captured. The presentation may be private or require login.',
      });
    }

    console.log(`[convert] PDF ready — ${pdfBuf.length} bytes, ${result.screenshots?.length ?? '?'} slides`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="presentation.pdf"',
      'Content-Length': pdfBuf.length,
    });
    return res.send(pdfBuf);

  } catch (err) {
    console.error('[convert error]', err.message);
    if (browser) await browser.close().catch(() => {});
    return res.status(500).json({ error: err.message || 'Conversion failed.' });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`pitch2pdf listening on port ${PORT}`));
