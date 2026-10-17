import { projects, projectCount } from './projects.js';
import { pageProgress } from './motion.js';

document.documentElement.classList.add('js-ready');

/** @template {HTMLElement} T @param {string} selector @returns {T} */
function element(selector) {
  const node = document.querySelector(selector);
  if (!(node instanceof HTMLElement)) throw new Error(`Missing element: ${selector}`);
  return /** @type {T} */ (node);
}

const menu = element('.menu-toggle');
const navigation = element('#navigation');
/** @param {boolean} open */
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (event.target instanceof Node && !navigation.contains(event.target) && !menu.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

element('#year').textContent = String(new Date().getFullYear());
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));

const progressBar = element('.scroll-progress');
const steps = [...document.querySelectorAll('.approach-step')];
const stepProgress = element('.step-progress span');
const sections = [...document.querySelectorAll('main section[id]')];
let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  progressBar.style.transform = `scaleX(${pageProgress(window.scrollY, window.innerHeight, document.documentElement.scrollHeight)})`;
  let activeStep = 0;
  steps.forEach((step, index) => { if (step.getBoundingClientRect().top < window.innerHeight * .65) activeStep = index; });
  steps.forEach((step, index) => step.classList.toggle('is-active', index === activeStep));
  stepProgress.style.width = `${((activeStep + 1) / steps.length) * 100}%`;
  let current = '';
  sections.forEach(section => { if (section.getBoundingClientRect().top < window.innerHeight * .4) current = section.id; });
  navigation.querySelectorAll('a').forEach(link => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('is-current', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
updateScroll();

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  const filter = button.getAttribute('data-filter') || 'all';
  document.querySelectorAll('.filter').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  document.querySelectorAll('.project-card').forEach(card => {
    if (card instanceof HTMLElement) {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) card.classList.add('is-visible');
    }
  });
  const count = projectCount(filter);
  element('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}.`;
  scheduleScroll();
}));

const dialog = /** @type {HTMLDialogElement} */ (element('#project-dialog'));
let previousFocus = /** @type {HTMLElement | null} */ (null);
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', event => {
  const key = /** @type {keyof typeof projects} */ (button.getAttribute('data-project'));
  const project = projects[key];
  if (!project) return;
  event.preventDefault();
  previousFocus = button instanceof HTMLElement ? button : null;
  element('#dialog-category').textContent = project.category;
  element('#dialog-title').textContent = project.title;
  element('#dialog-description').textContent = project.description;
  element('#dialog-detail').textContent = project.detail;
  element('#dialog-link').setAttribute('href', project.url);
  element('#dialog-link-label').textContent = project.linkLabel;
  if (project.url.startsWith('mailto:')) element('#dialog-link').removeAttribute('target');
  else element('#dialog-link').setAttribute('target', '_blank');
  element('#dialog-tags').replaceChildren(...project.tags.map(tag => {
    const node = document.createElement('span'); node.textContent = tag; return node;
  }));
  document.body.classList.add('dialog-open');
  dialog.showModal();
}));
element('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus({ preventScroll: true }); });

let copyTimeout = 0;
element('#copy-email').addEventListener('click', async () => {
  const status = element('#copy-status');
  window.clearTimeout(copyTimeout);
  try {
    await navigator.clipboard.writeText('piyushpatil.da@gmail.com');
    status.textContent = 'Email copied.';
  } catch {
    status.textContent = 'Select the email to copy, or click it to write.';
  }
  copyTimeout = window.setTimeout(() => { status.textContent = ''; }, 5000);
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let userMotion = /** @type {boolean | null} */ (null);
try { const saved = localStorage.getItem('portfolio-motion'); if (saved !== null) userMotion = saved === 'paused'; } catch { /* Storage is optional. */ }
let paused = userMotion ?? reducedMotion.matches;
let sceneController = /** @type {ReturnType<typeof import('./scene.js').createScene> | undefined} */ (undefined);
function updateMotion() {
  document.documentElement.classList.toggle('motion-off', paused);
  element('#motion-toggle').setAttribute('aria-pressed', String(paused));
  element('#motion-toggle').setAttribute('aria-label', paused ? 'Enable animations' : 'Pause animations');
  element('#motion-label').textContent = paused ? 'Motion off' : 'Motion on';
  sceneController?.setPaused(paused);
}
element('#motion-toggle').addEventListener('click', () => {
  paused = !paused; userMotion = paused;
  try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'on'); } catch { /* Storage is optional. */ }
  updateMotion();
});
reducedMotion.addEventListener('change', event => { if (userMotion === null) { paused = event.matches; updateMotion(); } });
updateMotion();

const sceneHost = element('#scene');
async function loadScene() {
  try {
    const { createScene } = await import('./scene.js');
    sceneController = createScene(sceneHost, paused);
  } catch {
    sceneHost.closest('.hero-art')?.classList.remove('scene-ready');
    sceneHost.replaceChildren();
  }
}
if ('requestIdleCallback' in window) window.requestIdleCallback(() => { void loadScene(); }, { timeout: 1000 });
else globalThis.setTimeout(() => { void loadScene(); }, 100);
