// Regenerate static/og/*.png social cards: node scripts/og-images.cjs "$(pwd)"
const { chromium } = require('playwright');
const path = require('path');
const root = process.argv[2];
const fs = require('fs');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'static/fonts/Archivo-VariableFont_wdth,wght.woff2')).toString('base64');
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'static/icon-logo.png')).toString('base64');
const cards = [
  ['default', 'Donor intelligence, <span>reimagined.</span>', 'AI prospect research that helps small nonprofits find new major donors — at a fraction of the cost.', 'getromy.app'],
  ['blog', 'Field notes on <span>fundraising.</span>', 'Major gifts, prospect research, donor stewardship and planned giving — for small nonprofit teams.', 'getromy.app/blog'],
  ['labs', 'PIF-Bench <span>v2.</span>', 'An open, blind-graded benchmark of AI on real nonprofit development work. 25 tasks, 331 checks.', 'getromy.app/labs'],
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const [name, h, sub, url] of cards) {
    await p.setContent(`<!doctype html><html><head><style>
@font-face{font-family:Archivo;src:url("${font}") format("woff2");font-weight:100 900;}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:Archivo,sans-serif;background:#fcfcfc;color:#0a0a0a;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse at 30% 40%,#000 20%,transparent 75%)}
.glow{position:absolute;width:700px;height:700px;right:-220px;bottom:-320px;background:radial-gradient(circle,#1d4ed8 0%,rgba(29,78,216,.25) 40%,transparent 70%);filter:blur(30px)}
.wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:16px;font-size:34px;font-weight:600;letter-spacing:-.02em}
.brand img{width:52px;height:52px}
h1{font-size:76px;font-weight:500;letter-spacing:-.035em;line-height:1.05;max-width:950px}
h1 span{color:#1d4ed8}
p{font-size:30px;line-height:1.35;color:#555;max-width:900px;margin-top:24px}
.url{font-size:24px;color:#777;font-weight:500}
</style></head><body><div class="grid"></div><div class="glow"></div><div class="wrap">
<div class="brand"><img src="${logo}">Rōmy</div>
<div><h1>${h}</h1><p>${sub}</p></div>
<div class="url">${url}</div></div></body></html>`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(root, 'static/og', name + '.png') });
  }
  await b.close();
})();
