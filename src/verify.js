/**
 * Automated Verification Suite for Portfolio Requirements
 */

import fs from 'fs';
import path from 'path';

function calculateLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrast(rgb1, rgb2) {
  const l1 = calculateLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = calculateLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function runVerification() {
  console.log('--- Starting Portfolio Constraints Verification ---');
  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  // 1. Files existence
  const html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('src/style.css', 'utf8');
  const contentTs = fs.readFileSync('src/content.ts', 'utf8');
  const contentJs = fs.readFileSync('src/content.js', 'utf8');
  const canvasEngine = fs.readFileSync('src/canvas-engine.js', 'utf8');
  const mainJs = fs.readFileSync('src/main.js', 'utf8');

  assert(html.length > 0, 'index.html exists and is populated');
  assert(css.length > 0, 'src/style.css exists and is populated');
  assert(contentTs.length > 0, 'src/content.ts exists and is populated');
  assert(contentJs.length > 0, 'src/content.js exists and is populated');
  assert(canvasEngine.length > 0, 'src/canvas-engine.js exists and is populated');
  assert(mainJs.length > 0, 'src/main.js exists and is populated');

  // 2. Palette Verification
  assert(css.includes('--color-bg: #0A3B42;'), 'CSS variable --color-bg is #0A3B42');
  assert(css.includes('--color-accent: #FFD23F;'), 'CSS variable --color-accent is #FFD23F');
  assert(css.includes('--color-text: #EAF1F4;'), 'CSS variable --color-text is #EAF1F4');

  // Check that all property declarations in CSS rules (outside :root) use var(--...) for colors
  const rootIndex = css.indexOf(':root');
  const rootEnd = css.indexOf('}', rootIndex);
  const rulesOutsideRoot = css.slice(rootEnd);

  // Check for raw hex colors outside root
  const hexMatches = rulesOutsideRoot.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  assert(hexMatches.length === 0, `All colours are CSS variables only (found ${hexMatches.length} raw hex outside :root)`);

  // 3. Contrast Ratios
  const bgRGB = [10, 59, 66]; // #0A3B42
  const textRGB = [234, 241, 244]; // #EAF1F4
  const accentRGB = [255, 210, 63]; // #FFD23F

  const textContrast = calculateContrast(bgRGB, textRGB);
  console.log(`Text Contrast (Text on BG): ${textContrast.toFixed(2)}:1`);
  assert(textContrast >= 4.5, `Text on BG satisfies WCAG AA (>= 4.5:1, got ${textContrast.toFixed(2)}:1)`);
  assert(textContrast >= 7.0, `Text on BG satisfies WCAG AAA (>= 7.0:1, got ${textContrast.toFixed(2)}:1)`);

  const accentContrast = calculateContrast(bgRGB, accentRGB);
  console.log(`Accent Contrast (Accent on BG): ${accentContrast.toFixed(2)}:1`);
  assert(accentContrast >= 4.5, `Accent on BG satisfies WCAG AA (>= 4.5:1, got ${accentContrast.toFixed(2)}:1)`);
  assert(accentContrast >= 7.0, `Accent on BG satisfies WCAG AAA (>= 7.0:1, got ${accentContrast.toFixed(2)}:1)`);

  const buttonTextContrast = calculateContrast(accentRGB, bgRGB);
  assert(buttonTextContrast >= 4.5, `Dark text on Accent button satisfies WCAG AA/AAA (got ${buttonTextContrast.toFixed(2)}:1)`);

  // 4. Typography
  assert(html.includes('family=Bricolage+Grotesque') && html.includes('family=Atkinson+Hyperlegible'), 'Google Fonts includes Bricolage Grotesque and Atkinson Hyperlegible');
  assert(css.includes("'Bricolage Grotesque'") && css.includes('--font-heading:'), 'Heading font set to Bricolage Grotesque');
  assert(css.includes("'Atkinson Hyperlegible'") && css.includes('--font-body:'), 'Body font set to Atkinson Hyperlegible');

  // 5. Accessibility features
  assert(html.includes('class="skip-link"') && html.includes('href="#main-content"'), 'Accessible skip-to-content link present');
  assert(css.includes(':focus-visible') && css.includes('outline:'), 'Visible focus styles defined for keyboard users');
  assert(html.includes('role="banner"') || html.includes('<header'), 'Semantic header present');
  assert(html.includes('<main id="main-content"'), 'Semantic main landmark present');
  assert(html.includes('<nav'), 'Semantic nav present');
  assert(html.includes('<footer'), 'Semantic footer present');

  // 6. 3D & Performance
  assert(canvasEngine.includes('Math.min(window.devicePixelRatio || 1, 1.5)'), 'Canvas caps devicePixelRatio at 1.5');
  assert(canvasEngine.includes('instances') && canvasEngine.includes('unitVertices'), 'Instanced mesh topology and instance buffer implemented');
  assert(!canvasEngine.toLowerCase().includes('shadowmap'), 'No realtime shadows');
  assert(canvasEngine.includes('prefers-reduced-motion') && css.includes('@media (prefers-reduced-motion: reduce)'), 'Prefers-reduced-motion fully supported in CSS and JS');

  // 7. Static URL flag & WebGL fallback
  assert(mainJs.includes("urlParams.get('static') === '1'"), '?static=1 URL parameter parsed');
  assert(html.includes('id="static-hero-fallback"') || html.includes('class="static-hero-fallback"'), 'Static hero fallback artwork present');
  assert(mainJs.includes('enableStaticMode'), 'Static mode toggle and fallback logic implemented');

  // 8. Grounded Content (No fake claims)
  const fakeMetrics = ['99.9%', '10x engineer', '100M+', 'increased conversion by', 'unicorn'];
  const hasFakeMetrics = fakeMetrics.some(m => contentTs.toLowerCase().includes(m));
  assert(!hasFakeMetrics, 'No invented vanity metrics or claims in content.ts');

  console.log(`\nVerification Summary: ${passCount} passed, ${failCount} failed.`);
  if (failCount > 0) process.exit(1);
}

runVerification();

