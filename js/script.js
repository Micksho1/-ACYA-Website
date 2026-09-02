// Mobile nav toggle
const burger = document.getElementById('burgerBtn');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// Events tabs (Next / Last)
const tabNext = document.getElementById('tabNext');
const tabLast = document.getElementById('tabLast');
const panelNext = document.getElementById('panelNext');
const panelLast = document.getElementById('panelLast');

function showPanel(which){
  const nextActive = which === 'next';
  tabNext.classList.toggle('active', nextActive);
  tabLast.classList.toggle('active', !nextActive);
  tabNext.setAttribute('aria-selected', nextActive);
  tabLast.setAttribute('aria-selected', !nextActive);
  panelNext.classList.toggle('active', nextActive);
  panelLast.classList.toggle('active', !nextActive);
}
tabNext.addEventListener('click', () => showPanel('next'));
tabLast.addEventListener('click', () => showPanel('last'));

// Gallery event filter (All / National Convention / NEC Meeting / National Conference)
const galleryTabs = document.querySelectorAll('.gallery-tabs .tab-btn');
let currentGalleryFilter = 'all';

function applyGalleryFilter(){
  document.querySelectorAll('#galleryGrid .g-item').forEach(item => {
    const matches = currentGalleryFilter === 'all' || item.dataset.event === currentGalleryFilter;
    item.classList.toggle('g-hidden', !matches);
  });
}
galleryTabs.forEach(btn => {
  btn.addEventListener('click', () => {
    galleryTabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentGalleryFilter = btn.dataset.filter;
    applyGalleryFilter();
  });
});

// Gallery lightbox — works for both "photos coming soon" placeholders and real uploaded photos.
// Call attachGalleryHandlers() again any time gallery tiles are replaced (e.g. after gallery.js loads real photos).
const lightbox = document.getElementById('lightbox');
const lightboxFill = document.getElementById('lightboxFill');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCrest = document.getElementById('lightboxCrest');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxSub = document.getElementById('lightboxSub');
const lightboxClose = document.getElementById('lightboxClose');

function attachGalleryHandlers(){
  document.querySelectorAll('#galleryGrid .g-item').forEach(item => {
    item.addEventListener('click', () => {
      const photoUrl = item.dataset.image;
      if (photoUrl) {
        lightboxImg.src = photoUrl;
        lightboxImg.style.display = 'block';
        lightboxCrest.style.display = 'none';
        lightboxSub.textContent = item.dataset.sub || '';
      } else {
        lightboxImg.style.display = 'none';
        lightboxCrest.style.display = 'block';
        lightboxSub.textContent = (item.dataset.sub || '') + ' — official photos coming soon.';
      }
      lightboxTitle.textContent = item.dataset.title || '';
      lightbox.classList.add('open');
    });
  });
  applyGalleryFilter();
}
attachGalleryHandlers();

lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
