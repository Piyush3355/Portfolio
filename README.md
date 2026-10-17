# Piyush Patil — Portfolio

A responsive portfolio built with HTML, CSS, JavaScript, and Three.js. An interactive chrome sculpture, scroll-led process section, and editorial typography connect quality engineering, data analysis, and web projects.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Vite serves the site on port 5173 by default.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. No API keys or backend are required. Contact links open an email client or WhatsApp; there is no simulated form submission.

## Content

- `index.html`: biography, accessible navigation, project artwork, toolkit, and contact information.
- `projects.js`: project descriptions, tags, and source repository links, used by the detail dialog.
- `scene.js`: lazy-loaded 3D sculpture with scroll and pointer interaction, visibility-aware rendering, and a CSS fallback.
- `motion.js`: bounded scroll progress and frame-rate-independent damping.
- `style.css`: responsive layouts and reduced-motion styling.

Project content is based on the owner's GitHub repositories. The artwork is illustrative, not project screenshots or test results. Employment, education, certifications, and resume downloads must be added only after a readable resume is supplied; the provided PDF was corrupted and is intentionally not included.

## Accessibility & performance

Native project dialogs support Escape and return focus to their trigger. Filters announce result counts. Navigation, contact, and the full reading experience remain available without JavaScript. Animation respects the system reduced-motion setting and can also be paused with a persistent preference. WebGL is lazy-loaded, pixel ratio is capped, and rendering pauses offscreen and in background tabs. Fonts are self-hosted under the SIL Open Font License (see `public/fonts/`).

## Verification

Node's built-in tests cover project mappings, links, markup invariants, and scroll math. ESLint checks JavaScript, TypeScript checks the typed JavaScript modules, and Vite produces the deployment build. Browser/device verification is a separate end-to-end check.
