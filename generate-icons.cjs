const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Master Vector SVG (512x512)
const svgMaster = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Radial Gradients -->
    <radialGradient id="bgRadial" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#0e2a6d" />
      <stop offset="50%" stop-color="#061642" />
      <stop offset="85%" stop-color="#030b26" />
      <stop offset="100%" stop-color="#010618" />
    </radialGradient>

    <!-- Outer Rim Highlight -->
    <linearGradient id="rimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="25%" stop-color="#1d4ed8" stop-opacity="0.5" />
      <stop offset="70%" stop-color="#1e3a8a" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#00f0ff" stop-opacity="0.85" />
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="docShadow" x="-20%" y="-20%" width="145%" height="145%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#01040f" flood-opacity="0.7" />
    </filter>
    <filter id="badgeShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#020617" flood-opacity="0.55" />
    </filter>
    <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#00f0ff" flood-opacity="0.8" />
    </filter>

    <!-- Fanned Sheets Gradients -->
    <linearGradient id="purpleSheet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6b21a8" />
    </linearGradient>
    <linearGradient id="blueSheet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>

    <!-- Main Front Document Gradient -->
    <linearGradient id="docGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="85%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>

    <!-- Curled Dog-Ear Corner -->
    <linearGradient id="curlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cce9ff" />
      <stop offset="50%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#f0f9ff" />
    </linearGradient>

    <!-- Big 3D Letter D Gradient -->
    <linearGradient id="dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="35%" stop-color="#2563eb" />
      <stop offset="75%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>

    <!-- Orbital Swoosh Gradient -->
    <linearGradient id="swooshGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <!-- PDF Badge Gradient -->
    <linearGradient id="pdfBadgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#b91c1c" />
    </linearGradient>
  </defs>

  <!-- Base App Icon Squircle -->
  <rect x="18" y="18" width="476" height="476" rx="108" ry="108" fill="url(#bgRadial)" />
  <rect x="18" y="18" width="476" height="476" rx="108" ry="108" fill="none" stroke="url(#rimGlow)" stroke-width="3.5" />

  <!-- Scanning Corner Framing Brackets -->
  <g stroke="#00d4ff" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#cyanGlow)">
    <!-- Top-Left -->
    <path d="M 74 136 V 104 A 30 30 0 0 1 104 74 H 136" />
    <!-- Top-Right -->
    <path d="M 376 74 H 408 A 30 30 0 0 1 438 104 V 136" />
    <!-- Bottom-Left -->
    <path d="M 74 376 V 408 A 30 30 0 0 0 104 438 H 136" />
    <!-- Bottom-Right -->
    <path d="M 376 438 H 408 A 30 30 0 0 0 438 408 V 376" />
  </g>

  <!-- Fanned Background Page 1: Purple -->
  <g transform="rotate(-11 200 240)">
    <rect x="105" y="120" width="170" height="235" rx="20" ry="20" fill="url(#purpleSheet)" opacity="0.95" filter="url(#docShadow)" />
  </g>

  <!-- Fanned Background Page 2: Royal Blue -->
  <g transform="rotate(-5 225 245)">
    <rect x="125" y="105" width="180" height="255" rx="20" ry="20" fill="url(#blueSheet)" opacity="0.98" filter="url(#docShadow)" />
  </g>

  <!-- Orbital Swoosh: Back Arc (behind the front document sheet) -->
  <path d="M 370 300 C 445 240 455 170 375 160" fill="none" stroke="url(#swooshGrad)" stroke-width="18" stroke-linecap="round" filter="url(#cyanGlow)" opacity="0.8" />

  <!-- Front Main White Document Sheet with Curled Top-Right Corner -->
  <g filter="url(#docShadow)">
    <!-- Main page body with folded cut corner -->
    <path d="
      M 174 86
      H 318
      L 380 148
      V 378
      A 22 22 0 0 1 358 400
      H 174
      A 22 22 0 0 1 152 378
      V 108
      A 22 22 0 0 1 174 86
      Z"
      fill="url(#docGrad)"
    />

    <!-- Curled Dog-Ear Corner Flap -->
    <path d="
      M 318 86
      V 132
      A 16 16 0 0 0 334 148
      H 380
      Z"
      fill="url(#curlGrad)"
      filter="url(#badgeShadow)"
    />
  </g>

  <!-- Top Document Horizontal Lines -->
  <rect x="180" y="118" width="90" height="11" rx="5.5" fill="#38bdf8" />
  <rect x="180" y="137" width="88" height="11" rx="5.5" fill="#38bdf8" />
  <rect x="180" y="156" width="48" height="11" rx="5.5" fill="#38bdf8" />

  <!-- Large Bold Letter D -->
  <path d="
    M 194 186
    H 262
    C 305 186 334 214 334 256
    C 334 298 305 326 262 326
    H 194
    Z
    M 230 220
    V 292
    H 258
    C 283 292 300 278 300 256
    C 300 234 283 220 258 220
    Z"
    fill="url(#dGrad)"
    fill-rule="evenodd"
  />

  <!-- Orbital Swoosh: Front Ribbon (crossing in front of the document) -->
  <path d="M 94 365 C 105 315 200 350 380 270" fill="none" stroke="url(#swooshGrad)" stroke-width="16" stroke-linecap="round" filter="url(#cyanGlow)" />

  <!-- Red "PDF" Badge -->
  <g filter="url(#badgeShadow)">
    <rect x="282" y="318" width="112" height="62" rx="16" ry="16" fill="url(#pdfBadgeGrad)" />
    <!-- 3D Top Inner Highlight -->
    <rect x="284" y="320" width="108" height="2" rx="1" fill="#ffffff" opacity="0.45" />
    <text x="338" y="361" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="28" letter-spacing="1.5" text-anchor="middle">PDF</text>
  </g>
</svg>`;

// Maskable Vector SVG (Full-bleed background with central 80% safe zone scaling)
const svgMaskable = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgRadialFull" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#0e2a6d" />
      <stop offset="50%" stop-color="#061642" />
      <stop offset="85%" stop-color="#030b26" />
      <stop offset="100%" stop-color="#010618" />
    </radialGradient>
    <filter id="docShadowM" x="-20%" y="-20%" width="145%" height="145%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#01040f" flood-opacity="0.7" />
    </filter>
    <filter id="badgeShadowM" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#020617" flood-opacity="0.55" />
    </filter>
    <filter id="cyanGlowM" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#00f0ff" flood-opacity="0.8" />
    </filter>
    <linearGradient id="purpleSheetM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6b21a8" />
    </linearGradient>
    <linearGradient id="blueSheetM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <linearGradient id="docGradM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="85%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <linearGradient id="curlGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cce9ff" />
      <stop offset="50%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#f0f9ff" />
    </linearGradient>
    <linearGradient id="dGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="35%" stop-color="#2563eb" />
      <stop offset="75%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
    <linearGradient id="swooshGradM" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="pdfBadgeGradM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#b91c1c" />
    </linearGradient>
  </defs>

  <!-- Full Bleed Background for Android Maskable Circles/Squircles -->
  <rect width="512" height="512" fill="url(#bgRadialFull)" />

  <!-- Centered Content Scaled to 80% to fit within Android safe zone -->
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <!-- Scanning Corner Brackets -->
    <g stroke="#00d4ff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#cyanGlowM)">
      <path d="M 74 136 V 104 A 30 30 0 0 1 104 74 H 136" />
      <path d="M 376 74 H 408 A 30 30 0 0 1 438 104 V 136" />
      <path d="M 74 376 V 408 A 30 30 0 0 0 104 438 H 136" />
      <path d="M 376 438 H 408 A 30 30 0 0 0 438 408 V 376" />
    </g>

    <!-- Fanned Background Page 1: Purple -->
    <g transform="rotate(-11 200 240)">
      <rect x="105" y="120" width="170" height="235" rx="20" ry="20" fill="url(#purpleSheetM)" opacity="0.95" filter="url(#docShadowM)" />
    </g>

    <!-- Fanned Background Page 2: Royal Blue -->
    <g transform="rotate(-5 225 245)">
      <rect x="125" y="105" width="180" height="255" rx="20" ry="20" fill="url(#blueSheetM)" opacity="0.98" filter="url(#docShadowM)" />
    </g>

    <!-- Orbital Swoosh Back Arc -->
    <path d="M 370 300 C 445 240 455 170 375 160" fill="none" stroke="url(#swooshGradM)" stroke-width="18" stroke-linecap="round" filter="url(#cyanGlowM)" opacity="0.8" />

    <!-- Front Main White Document Sheet -->
    <g filter="url(#docShadowM)">
      <path d="
        M 174 86
        H 318
        L 380 148
        V 378
        A 22 22 0 0 1 358 400
        H 174
        A 22 22 0 0 1 152 378
        V 108
        A 22 22 0 0 1 174 86
        Z"
        fill="url(#docGradM)"
      />
      <path d="
        M 318 86
        V 132
        A 16 16 0 0 0 334 148
        H 380
        Z"
        fill="url(#curlGradM)"
        filter="url(#badgeShadowM)"
      />
    </g>

    <!-- Top Document Lines -->
    <rect x="180" y="118" width="90" height="11" rx="5.5" fill="#38bdf8" />
    <rect x="180" y="137" width="88" height="11" rx="5.5" fill="#38bdf8" />
    <rect x="180" y="156" width="48" height="11" rx="5.5" fill="#38bdf8" />

    <!-- Large Bold Letter D -->
    <path d="
      M 194 186
      H 262
      C 305 186 334 214 334 256
      C 334 298 305 326 262 326
      H 194
      Z
      M 230 220
      V 292
      H 258
      C 283 292 300 278 300 256
      C 300 234 283 220 258 220
      Z"
      fill="url(#dGradM)"
      fill-rule="evenodd"
    />

    <!-- Orbital Swoosh Front Ribbon -->
    <path d="M 94 365 C 105 315 200 350 380 270" fill="none" stroke="url(#swooshGradM)" stroke-width="16" stroke-linecap="round" filter="url(#cyanGlowM)" />

    <!-- Red 'PDF' Badge -->
    <g filter="url(#badgeShadowM)">
      <rect x="282" y="318" width="112" height="62" rx="16" ry="16" fill="url(#pdfBadgeGradM)" />
      <rect x="284" y="320" width="108" height="2" rx="1" fill="#ffffff" opacity="0.45" />
      <text x="338" y="361" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="28" letter-spacing="1.5" text-anchor="middle">PDF</text>
    </g>
  </g>
</svg>`;

// Write master SVG files
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgMaster, 'utf-8');
const tmpMaskableSvg = path.join(publicDir, 'temp-maskable.svg');
fs.writeFileSync(tmpMaskableSvg, svgMaskable, 'utf-8');

console.log('Generating PNG icon sizes with rsvg-convert & imagemagick...');

// 1. PWA Icons
execSync(`rsvg-convert -w 512 -h 512 "${path.join(publicDir, 'icon.svg')}" -o "${path.join(publicDir, 'pwa-512x512.png')}"`);
execSync(`rsvg-convert -w 192 -h 192 "${path.join(publicDir, 'icon.svg')}" -o "${path.join(publicDir, 'pwa-192x192.png')}"`);
execSync(`rsvg-convert -w 512 -h 512 "${tmpMaskableSvg}" -o "${path.join(publicDir, 'pwa-maskable-512x512.png')}"`);
fs.unlinkSync(tmpMaskableSvg);

// 2. Apple Touch Icon (180x180)
execSync(`rsvg-convert -w 180 -h 180 "${path.join(publicDir, 'icon.svg')}" -o "${path.join(publicDir, 'apple-touch-icon.png')}"`);

// 3. Generic Icon (512x512)
fs.copyFileSync(path.join(publicDir, 'pwa-512x512.png'), path.join(publicDir, 'icon.png'));

// 4. Favicon PNGs
execSync(`rsvg-convert -w 32 -h 32 "${path.join(publicDir, 'icon.svg')}" -o "${path.join(publicDir, 'favicon-32x32.png')}"`);
execSync(`rsvg-convert -w 16 -h 16 "${path.join(publicDir, 'icon.svg')}" -o "${path.join(publicDir, 'favicon-16x16.png')}"`);

// 5. Multi-size favicon.ico
execSync(`convert "${path.join(publicDir, 'favicon-16x16.png')}" "${path.join(publicDir, 'favicon-32x32.png')}" "${path.join(publicDir, 'favicon.ico')}"`);

console.log('All icons generated successfully!');
