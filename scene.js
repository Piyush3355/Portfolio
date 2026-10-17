import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clamp01, damp } from './motion.js';

/** @param {HTMLElement} container @param {boolean} initialPaused */
export function createScene(container, initialPaused) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x131612, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
  camera.position.set(0, 0, 8.6);
  function createEnvironment() {
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    try {
      return pmrem.fromScene(environment, .04);
    } finally {
      environment.dispose();
      pmrem.dispose();
    }
  }
  let environmentMap = createEnvironment();
  scene.environment = environmentMap.texture;

  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const chrome = new THREE.MeshStandardMaterial({ color: 0xc9d4be, metalness: 1, roughness: .21 });
  const lime = new THREE.MeshStandardMaterial({ color: 0xb5f66b, metalness: .5, roughness: .22 });
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.13, .36, 180, 28, 2, 3), chrome);
  knot.rotation.set(.45, -.3, -.2);
  sculpture.add(knot);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, .035, 12, 120), lime);
  ring.rotation.set(1.05, -.5, .25);
  sculpture.add(ring);
  const secondRing = new THREE.Mesh(new THREE.TorusGeometry(2.15, .008, 6, 100), new THREE.MeshBasicMaterial({ color: 0x738c55, transparent: true, opacity: .5 }));
  secondRing.rotation.set(.8, .8, -.3);
  sculpture.add(secondRing);

  const satellite = new THREE.Mesh(new THREE.SphereGeometry(.15, 20, 16), lime);
  satellite.position.set(1.7, 1.2, .7);
  sculpture.add(satellite);
  const light = new THREE.DirectionalLight(0xd4ffac, 5);
  light.position.set(3, 3, 3);
  scene.add(light);
  const rim = new THREE.PointLight(0xb7f86e, 18, 20);
  rim.position.set(-3, -1, 2);
  scene.add(rim);

  let paused = initialPaused;
  let visible = true;
  let failed = false;
  let frame = 0;
  let lastTime = 0;
  let time = 0;
  let scrollTarget = 0;
  let scroll = 0;
  const pointer = { x: 0, y: 0 };
  const smoothedPointer = { x: 0, y: 0 };
  const rotationLabel = document.getElementById('rotation-value');

  function render() { renderer.render(scene, camera); }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height || failed) return;
    camera.aspect = width / height;
    camera.position.z = camera.aspect < .9 ? 9.8 : 8.6;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
  }
  /** @param {number} now */
  function animate(now) {
    frame = 0;
    if (paused || !visible || document.hidden || failed) return;
    const delta = lastTime ? Math.min((now - lastTime) / 1000, .05) : 0;
    lastTime = now;
    time += delta;
    scroll = damp(scroll, scrollTarget, delta);
    smoothedPointer.x = damp(smoothedPointer.x, pointer.x, delta);
    smoothedPointer.y = damp(smoothedPointer.y, pointer.y, delta);
    sculpture.rotation.y = time * .1 + scroll * Math.PI * 1.2 + smoothedPointer.x * .18;
    sculpture.rotation.x = Math.sin(time * .22) * .08 + scroll * .65 + smoothedPointer.y * .12;
    sculpture.rotation.z = scroll * -.3;
    sculpture.position.y = Math.sin(time * .7) * .08 - scroll * .18;
    ring.rotation.z = time * .08 + scroll * .8;
    satellite.position.x = Math.cos(time * .4) * 1.9;
    satellite.position.y = Math.sin(time * .4) * 1.3;
    if (rotationLabel) rotationLabel.textContent = (scroll * 180).toFixed(2);
    render();
    frame = requestAnimationFrame(animate);
  }
  function start() {
    if (!frame && !paused && visible && !document.hidden && !failed) {
      lastTime = 0;
      frame = requestAnimationFrame(animate);
    }
  }
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  function onScroll() { scrollTarget = clamp01(window.scrollY / Math.max(window.innerHeight * .8, 1)); start(); }
  /** @param {PointerEvent} event */
  function onPointer(event) {
    if (event.pointerType !== 'mouse') return;
    const bounds = container.getBoundingClientRect();
    pointer.x = clamp01((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = clamp01((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  }
  function onVisibility() { if (document.hidden) stop(); else start(); }
  /** @param {Event} event */
  function onContextLost(event) {
    event.preventDefault();
    failed = true;
    stop();
    container.closest('.hero-art')?.classList.remove('scene-ready');
    renderer.domElement.style.display = 'none';
  }
  function onContextRestored() {
    try {
      // Render-target contents do not survive a WebGL context loss.
      environmentMap.dispose();
      environmentMap = createEnvironment();
      scene.environment = environmentMap.texture;
      failed = false;
      renderer.domElement.style.display = '';
      resize();
      container.closest('.hero-art')?.classList.add('scene-ready');
      onScroll();
    } catch {
      failed = true;
      stop();
      container.closest('.hero-art')?.classList.remove('scene-ready');
      renderer.domElement.style.display = 'none';
    }
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) start(); else stop();
  }, { rootMargin: '80px' });
  visibilityObserver.observe(container);
  window.addEventListener('scroll', onScroll, { passive: true });
  container.addEventListener('pointermove', onPointer);
  document.addEventListener('visibilitychange', onVisibility);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
  resize();
  onScroll();
  container.closest('.hero-art')?.classList.add('scene-ready');

  return {
    /** @param {boolean} value */
    setPaused(value) { paused = value; if (paused) stop(); else start(); },
    dispose() {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      container.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(material => material.dispose());
        }
      });
      environmentMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
