<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>pitch2pdf – Convert Presentations to PDF</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --card: #13131a;
    --border: #1e1e2e;
    --accent: #6c63ff;
    --accent2: #a78bfa;
    --text: #e8e8f0;
    --muted: #6b6b85;
    --success: #22d3a5;
    --error: #f87171;
    --radius: 14px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.6;
  }

  /* NAV */
  nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 40px;
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(10px);
    position: sticky; top: 0; z-index: 100;
    background: rgba(10,10,15,0.85);
  }
  .logo { font-weight: 800; font-size: 1.1rem; color: #fff; letter-spacing: -0.5px; }
  .logo span { color: var(--accent2); }
  .nav-links { display: flex; gap: 28px; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.88rem; transition: color .2s; }
  .nav-links a:hover { color: var(--text); }

  /* HERO */
  .hero {
    text-align: center;
    padding: 90px 20px 60px;
    background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108,99,255,0.18) 0%, transparent 70%);
  }
  .badge {
    display: inline-block; background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.3);
    color: var(--accent2); border-radius: 99px; padding: 4px 14px; font-size: 0.78rem;
    letter-spacing: 0.05em; margin-bottom: 20px; text-transform: uppercase;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 800; line-height: 1.15;
    letter-spacing: -1.5px; color: #fff; margin-bottom: 16px;
  }
  .hero h1 em { font-style: normal; color: var(--accent2); }
  .hero p { color: var(--muted); max-width: 520px; margin: 0 auto 40px; font-size: 1.05rem; }

  /* CONVERTER CARD */
  .converter-wrap { max-width: 660px; margin: 0 auto; padding: 0 20px; }
  .converter-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 28px;
    box-shadow: 0 0 60px rgba(108,99,255,0.08);
  }

  .url-row { display: flex; gap: 10px; }
  .url-input {
    flex: 1; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px; color: var(--text);
    font-size: 0.95rem; outline: none; transition: border-color .2s;
  }
  .url-input::placeholder { color: var(--muted); }
  .url-input:focus { border-color: var(--accent); }

  .btn-convert {
    background: var(--accent); border: none; border-radius: 10px;
    padding: 14px 24px; color: #fff; font-size: 0.95rem; font-weight: 600;
    cursor: pointer; white-space: nowrap; transition: background .2s, transform .1s;
  }
  .btn-convert:hover { background: #7c74ff; }
  .btn-convert:active { transform: scale(0.98); }
  .btn-convert:disabled { background: #3d3a6b; cursor: not-allowed; }

  .creds-toggle {
    margin-top: 12px; display: flex; align-items: center; gap: 8px;
    cursor: pointer; user-select: none; width: fit-content;
  }
  .creds-toggle input[type=checkbox] { accent-color: var(--accent); width: 15px; height: 15px; cursor: pointer; }
  .creds-toggle label { color: var(--muted); font-size: 0.85rem; cursor: pointer; }

  .creds-fields {
    margin-top: 12px; display: none; gap: 10px;
  }
  .creds-fields.visible { display: flex; }
  .creds-input {
    flex: 1; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 14px; color: var(--text);
    font-size: 0.88rem; outline: none; transition: border-color .2s;
  }
  .creds-input::placeholder { color: var(--muted); }
  .creds-input:focus { border-color: var(--accent); }

  /* STATUS */
  .status-box { margin-top: 20px; display: none; }
  .status-box.visible { display: block; }

  .progress-wrap { background: var(--bg); border-radius: 99px; height: 6px; overflow: hidden; }
  .progress-bar {
    height: 100%; width: 0%; border-radius: 99px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transition: width .4s ease;
  }
  .status-text { font-size: 0.85rem; color: var(--muted); margin-top: 10px; }
  .status-success { color: var(--success); }
  .status-error { color: var(--error); }

  .btn-download {
    display: none; margin-top: 14px; width: 100%;
    background: linear-gradient(135deg, var(--success), #059e7a);
    border: none; border-radius: 10px; padding: 14px;
    color: #fff; font-size: 0.95rem; font-weight: 700;
    cursor: pointer; transition: opacity .2s;
  }
  .btn-download:hover { opacity: 0.9; }
  .btn-download.visible { display: block; }

  /* SERVICES */
  .section { max-width: 860px; margin: 80px auto; padding: 0 24px; }
  .section-title { font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 10px; }
  .section-sub { color: var(--muted); text-align: center; margin-bottom: 40px; font-size: 0.95rem; }

  .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .service-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 22px;
    transition: border-color .2s, transform .2s;
    cursor: default;
  }
  .service-card:hover { border-color: rgba(108,99,255,0.4); transform: translateY(-2px); }
  .service-icon { font-size: 1.6rem; margin-bottom: 10px; }
  .service-name { font-weight: 700; margin-bottom: 6px; font-size: 0.95rem; }
  .service-desc { color: var(--muted); font-size: 0.83rem; line-height: 1.5; }

  /* HOW IT WORKS */
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
  .step { text-align: center; }
  .step-num {
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.3);
    color: var(--accent2); font-weight: 800; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .step h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
  .step p { color: var(--muted); font-size: 0.85rem; }

  /* FAQ */
  .faq-list { display: flex; flex-direction: column; gap: 10px; max-width: 680px; margin: 0 auto; }
  .faq-item {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .faq-q {
    padding: 16px 20px; font-weight: 600; font-size: 0.9rem;
    cursor: pointer; display: flex; justify-content: space-between; align-items: center;
    user-select: none;
  }
  .faq-q:hover { color: var(--accent2); }
  .faq-chevron { transition: transform .25s; font-size: 0.8rem; color: var(--muted); }
  .faq-a { display: none; padding: 0 20px 16px; color: var(--muted); font-size: 0.88rem; line-height: 1.65; }
  .faq-item.open .faq-a { display: block; }
  .faq-item.open .faq-chevron { transform: rotate(180deg); }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border); text-align: center;
    padding: 30px 20px; color: var(--muted); font-size: 0.82rem; margin-top: 80px;
  }
  footer a { color: var(--muted); text-decoration: none; margin: 0 10px; }
  footer a:hover { color: var(--text); }

  /* DETECTED BADGE */
  .detected-badge {
    display: none; margin-top: 12px; align-items: center; gap: 8px;
    font-size: 0.82rem; color: var(--success);
  }
  .detected-badge.visible { display: flex; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); }
</style>
</head>
<body>

<nav>
  <div class="logo">pitch<span>2</span>pdf</div>
  <div class="nav-links">
    <a href="#">Pitch</a>
    <a href="#">DocSend</a>
    <a href="#">Google Slides</a>
    <a href="#">Canva</a>
    <a href="#">About</a>
  </div>
</nav>

<section class="hero">
  <div class="badge">Free &amp; No Signup Required</div>
  <h1>Convert Presentations<br>to <em>PDF Instantly</em></h1>
  <p>Paste any Pitch, DocSend, Google Slides, Google Drive, or Canva link and download a high-quality PDF in seconds.</p>

  <div class="converter-wrap">
    <div class="converter-card">
      <div class="url-row">
        <input class="url-input" id="urlInput" type="url" placeholder="Paste your presentation URL…" autocomplete="off" />
        <button class="btn-convert" id="convertBtn" onclick="startConvert()">Convert to PDF</button>
      </div>

      <div class="detected-badge" id="detectedBadge">
        <div class="dot"></div>
        <span id="detectedText">Detected: Pitch.com</span>
      </div>

      <div class="creds-toggle">
        <input type="checkbox" id="credsCheck" onchange="toggleCreds(this)">
        <label for="credsCheck">Private presentation? Add credentials</label>
      </div>

      <div class="creds-fields" id="credsFields">
        <input class="creds-input" id="emailInput" type="email" placeholder="Email / Username">
        <input class="creds-input" id="passInput" type="password" placeholder="Password">
      </div>

      <div class="status-box" id="statusBox">
        <div class="progress-wrap"><div class="progress-bar" id="progressBar"></div></div>
        <div class="status-text" id="statusText">Initializing…</div>
        <button class="btn-download" id="downloadBtn">⬇ Download PDF</button>
      </div>
    </div>
  </div>
</section>

<!-- Supported Services -->
<section class="section">
  <h2 class="section-title">Supported Services</h2>
  <p class="section-sub">Works with all the major presentation platforms — no extensions needed.</p>
  <div class="services-grid">
    <div class="service-card">
      <div class="service-icon">🎯</div>
      <div class="service-name">Pitch.com</div>
      <div class="service-desc">Convert any Pitch presentation to PDF. Supports standard URLs, white-label subdomains, and custom domains.</div>
    </div>
    <div class="service-card">
      <div class="service-icon">📄</div>
      <div class="service-name">DocSend</div>
      <div class="service-desc">Download DocSend decks without access restrictions, expiring links, or view limits.</div>
    </div>
    <div class="service-card">
      <div class="service-icon">📊</div>
      <div class="service-name">Google Slides</div>
      <div class="service-desc">Export public Google Slides without a Google account or edit access required.</div>
    </div>
    <div class="service-card">
      <div class="service-icon">📁</div>
      <div class="service-name">Google Drive</div>
      <div class="service-desc">Convert shared Docs, Sheets, and Slides from Google Drive to PDF with ease.</div>
    </div>
    <div class="service-card">
      <div class="service-icon">🎨</div>
      <div class="service-name">Canva</div>
      <div class="service-desc">Convert Canva designs and presentations to PDF from any public view link — no account required.</div>
    </div>
  </div>
</section>

<!-- How it works -->
<section class="section">
  <h2 class="section-title">How It Works</h2>
  <p class="section-sub">Three simple steps to get your PDF.</p>
  <div class="steps">
    <div class="step">
      <div class="step-num">1</div>
      <h3>Paste Your URL</h3>
      <p>Copy and paste the link to your Pitch, DocSend, Google Slides, Drive, or Canva presentation.</p>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <h3>Click Convert</h3>
      <p>We automatically detect your platform and capture each slide as a high-resolution screenshot.</p>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <h3>Download PDF</h3>
      <p>Your PDF is ready in seconds. Click download and you're done — no signup, no watermarks.</p>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section">
  <h2 class="section-title">Frequently Asked Questions</h2>
  <p class="section-sub">Everything you need to know.</p>
  <div class="faq-list" id="faqList">
    <div class="faq-item">
      <div class="faq-q">How does pitch2pdf work? <span class="faq-chevron">▼</span></div>
      <div class="faq-a">pitch2pdf uses browser automation to load your presentation, capture each slide as a high-resolution screenshot, and assemble them into a downloadable PDF file.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What services are supported? <span class="faq-chevron">▼</span></div>
      <div class="faq-a">We support Pitch.com (including white-label instances), DocSend, Google Slides, Google Drive, and Canva.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What happens to my credentials? <span class="faq-chevron">▼</span></div>
      <div class="faq-a">Credentials are used only to authenticate your session for the conversion request and are never stored or logged on our servers.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Is pitch2pdf free? <span class="faq-chevron">▼</span></div>
      <div class="faq-a">Yes — pitch2pdf is completely free to use with no signup, no watermarks, and no limits.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do you support Pitch white-label domains? <span class="faq-chevron">▼</span></div>
      <div class="faq-a">Yes. We automatically detect standard pitch.com URLs, pitch.*.com subdomains, and custom white-label domains.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">How long does conversion take? <span class="faq-chevron">▼</span></div>
      <div class="faq-a">Most presentations are converted in under 60 seconds, depending on the number of slides and your connection speed.</div>
    </div>
  </div>
</section>

<footer>
  <div style="margin-bottom:12px">© 2026 pitch2pdf</div>
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Privacy</a>
  <a href="#">Terms</a>
  <a href="#">CLI</a>
</footer>

<script>
  // ── URL detection ──────────────────────────────────────────
  const urlInput = document.getElementById('urlInput');
  const detectedBadge = document.getElementById('detectedBadge');
  const detectedText = document.getElementById('detectedText');

  const SERVICES = [
    { pattern: /pitch\.com|pitch\.[a-z]+\.com/i, name: 'Pitch.com' },
    { pattern: /docsend\.com/i, name: 'DocSend' },
    { pattern: /docs\.google\.com\/presentation/i, name: 'Google Slides' },
    { pattern: /drive\.google\.com/i, name: 'Google Drive' },
    { pattern: /canva\.com/i, name: 'Canva' },
  ];

  urlInput.addEventListener('input', () => {
    const val = urlInput.value.trim();
    const match = SERVICES.find(s => s.pattern.test(val));
    if (match) {
      detectedText.textContent = 'Detected: ' + match.name;
      detectedBadge.classList.add('visible');
    } else {
      detectedBadge.classList.remove('visible');
    }
  });

  // ── Credentials toggle ─────────────────────────────────────
  function toggleCreds(cb) {
    document.getElementById('credsFields').classList.toggle('visible', cb.checked);
  }

  // ── Conversion ─────────────────────────────────────────────
  const statusBox = document.getElementById('statusBox');
  const progressBar = document.getElementById('progressBar');
  const statusText = document.getElementById('statusText');
  const downloadBtn = document.getElementById('downloadBtn');
  const convertBtn = document.getElementById('convertBtn');

  function setStatus(msg, pct, cls = '') {
    statusText.textContent = msg;
    statusText.className = 'status-text ' + cls;
    progressBar.style.width = pct + '%';
  }

  async function startConvert() {
    const url = urlInput.value.trim();
    if (!url) { urlInput.focus(); return; }

    // Validate URL
    try { new URL(url); } catch {
      statusBox.classList.add('visible');
      setStatus('⚠ Please enter a valid URL.', 0, 'status-error');
      return;
    }

    const service = SERVICES.find(s => s.pattern.test(url));

    convertBtn.disabled = true;
    downloadBtn.classList.remove('visible');
    statusBox.classList.add('visible');
    setStatus('Initializing browser…', 5);

    const API_BASE = 'http://localhost:3001'; // ← change to your deployed backend URL

    const email = document.getElementById('emailInput').value;
    const pass  = document.getElementById('passInput').value;

    // Animated progress while waiting for server
    const fakeSteps = [
      [15, 'Loading presentation…'],
      [35, 'Detecting slides…'],
      [55, 'Capturing screenshots…'],
      [75, 'Assembling PDF…'],
      [90, 'Finalizing…'],
    ];
    let stepIdx = 0;
    const ticker = setInterval(() => {
      if (stepIdx < fakeSteps.length) {
        const [pct, msg] = fakeSteps[stepIdx++];
        setStatus(msg, pct);
      }
    }, 1800);

    let pdfBlob;
    try {
      const res = await fetch(`${API_BASE}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email, password: pass }),
      });
      clearInterval(ticker);
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error);
      }
      pdfBlob = await res.blob();
    } catch (err) {
      clearInterval(ticker);
      setStatus('✗ ' + err.message, 0, 'status-error');
      convertBtn.disabled = false;
      return;
    }

    setStatus('✓ Conversion complete!', 100, 'status-success');
    downloadBtn.classList.add('visible');
    downloadBtn.onclick = () => {
      const objUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = objUrl; a.download = 'presentation.pdf';
      a.click();
      setTimeout(() => URL.revokeObjectURL(objUrl), 5000);
    };

    convertBtn.disabled = false;
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ── FAQ accordion ──────────────────────────────────────────
  document.getElementById('faqList').addEventListener('click', e => {
    const q = e.target.closest('.faq-q');
    if (!q) return;
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });

  // Enter key submits
  urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') startConvert(); });
</script>
</body>
</html>
