// Loads real event photos from Supabase into the gallery, replacing the
// "photos coming soon" placeholder cards. If Supabase isn't configured yet,
// or there are no photos uploaded for a given event, the placeholder stays
// put — so the site never looks broken while photos are still being added.
(async function () {
  if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR_')) {
    return; // not configured yet
  }

  try {
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await client
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return;

    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    data.forEach(photo => {
      const btn = document.createElement('button');
      btn.className = 'g-item';
      btn.dataset.event = photo.event_type || 'National Convention';
      btn.dataset.title = photo.title || '';
      btn.dataset.sub = photo.caption || '';
      btn.dataset.image = photo.image_url;
      btn.innerHTML = `
        <span class="g-thumb"><img src="${photo.image_url}" alt="${(photo.title || '').replace(/"/g, '&quot;')}" class="g-photo" loading="lazy"></span>
        <span class="g-body">
          <span class="g-title">${photo.title || ''}</span>
          <span class="g-sub">${photo.caption || ''}</span>
        </span>`;
      grid.appendChild(btn);
    });

    // Re-bind the lightbox and filter handlers to the new, real tiles.
    if (typeof attachGalleryHandlers === 'function') attachGalleryHandlers();
  } catch (err) {
    console.warn('Gallery photos could not be loaded from Supabase — showing placeholders instead.', err);
  }
})();
