/* Una transición por gesto de rueda; el scroll de páginas largas se conserva. */
(() => {
 const dots = [...document.querySelectorAll('.drink-dot')];
 const current = dots.findIndex(dot => dot.getAttribute('aria-current') === 'page');
 let sum = 0, last = 0, moving = false;
 const readyAt = performance.now() + 1200;
 window.addEventListener('wheel', event => {
  if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  if (event.target.closest('input, textarea, select')) return;
  const direction = Math.sign(event.deltaY);
  const root = document.documentElement;
  const atTop = window.scrollY <= 2;
  const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 3;
  if ((direction > 0 && !atBottom) || (direction < 0 && !atTop)) { sum = 0; return; }
  const target = current + direction;
  if (target < 0 || target >= dots.length || !direction) return;
  event.preventDefault();
  const now = performance.now();
  if (moving || now < readyAt) return;
  if (now - last > 200 || Math.sign(sum) !== direction) sum = 0;
  last = now;
  const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  sum += event.deltaY * multiplier;
  if (Math.abs(sum) < 75) return;
  moving = true;
  window.location.assign(dots[target].href);
 }, { passive: false });
})();
