# Piyush Patil — Portfolio

A responsive Software QA Engineer portfolio built with HTML, CSS, JavaScript, and Three.js. An interactive chrome sculpture, scroll-led process section, and editorial typography present Piyush Patil's API, automation, and AI testing experience.

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

Professional content is based on the resume text supplied by the owner: Sattvabit, CodeLamda Technologies, Elefant.ai, Inbuildify, and North Maharashtra University. The automation practice card links to the owner's public Python/Playwright repository. Client project actions open an email conversation rather than implying that private source code is public. Artwork is illustrative, not project screenshots or live test results. A downloadable resume is generated from the supplied text; LinkedIn is omitted because no profile URL was provided.

## Accessibility & performance

Native project dialogs support Escape and return focus to their trigger. Filters announce result counts. Navigation, contact, and the full reading experience remain available without JavaScript. Animation respects the system reduced-motion setting and can also be paused with a persistent preference. WebGL is lazy-loaded, pixel ratio is capped, and rendering pauses offscreen and in background tabs. Fonts are self-hosted under the SIL Open Font License (see `public/fonts/`).

## Verification

Node's built-in tests cover project mappings, links, markup invariants, and scroll math. ESLint checks JavaScript, TypeScript checks the typed JavaScript modules, and Vite produces the deployment build. Earlier design checks predate the resume integration. Further testing was cancelled at the owner's request; the owner will test the final content through the running preview.
