import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projects, projectCount } from '../projects.js';
import { clamp01, pageProgress, damp } from '../motion.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('scroll progress is bounded, including short pages and overscroll', () => {
  assert.equal(pageProgress(0, 900, 4000), 0);
  assert.equal(pageProgress(1550, 900, 4000), .5);
  assert.equal(pageProgress(9000, 900, 4000), 1);
  assert.equal(pageProgress(-100, 900, 4000), 0);
  assert.equal(pageProgress(100, 900, 400), 0);
  assert.equal(clamp01(.42), .42);
});

test('damping converges without overshooting and respects elapsed time', () => {
  assert.equal(damp(0, 1, 0), 0);
  assert.equal(damp(0, 1, -1), 0);
  assert.ok(damp(0, 1, .1) > 0 && damp(0, 1, .1) < 1);
  const twoFrames = damp(damp(0, 1, .05), 1, .05);
  assert.ok(Math.abs(twoFrames - damp(0, 1, .1)) < 1e-10);
});

test('project filters map to resume case studies and public automation work', () => {
  assert.equal(projectCount('all'), 3);
  for (const filter of ['quality', 'saas', 'automation']) assert.equal(projectCount(filter), 1);
  assert.equal(projectCount('unknown'), 0);
  for (const project of Object.values(projects)) {
    const url = new URL(project.url);
    if (project.filter === 'automation') {
      assert.equal(url.hostname, 'github.com');
      assert.ok(url.pathname.startsWith('/Piyush3355/'));
    } else {
      assert.equal(url.protocol, 'mailto:');
      assert.equal(url.pathname, 'piyushpatil.da@gmail.com');
    }
    assert.ok(project.title && project.description && project.detail && project.tags.length);
  }
});

test('every project button has matching detail data', () => {
  const keys = [...html.matchAll(/data-project="([^"]+)"/g)].map(match => match[1]);
  assert.equal(keys.length, 6);
  for (const key of keys) assert.ok(key in projects, `Missing details for ${key}`);
});

test('navigation anchors and SVG references resolve without duplicate IDs', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Unresolved #${match[1]}`);
});

test('external links are isolated and no placeholder links are shipped', () => {
  assert.ok(!/href="#"/.test(html));
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(match[0], /rel="noopener noreferrer"/);
  assert.ok(!html.includes('Piyush_Patil_QA.pdf'), 'Do not distribute the corrupted resume');
});

test('the static page retains navigation and contact without JavaScript', () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /href="mailto:piyushpatil.da@gmail.com"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /aria-labelledby="dialog-title"/);
});
