const BUCKET = 'gallery-photos';

if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR_')) {
  document.getElementById('loginSection').innerHTML =
    '<h1>Gallery admin</h1><p class="admin-sub">Supabase isn\'t configured yet. Fill in js/supabase-config.js with your project URL and anon key first — see README.md.</p>';
} else {
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const loginSection = document.getElementById('loginSection');
  const uploadSection = document.getElementById('uploadSection');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const userEmail = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  const uploadForm = document.getElementById('uploadForm');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadError = document.getElementById('uploadError');
  const uploadSuccess = document.getElementById('uploadSuccess');
  const photoList = document.getElementById('photoList');

  function showSignedIn(session){
    loginSection.hidden = true;
    uploadSection.hidden = false;
    userEmail.textContent = session.user.email;
    loadPhotos();
  }
  function showSignedOut(){
    loginSection.hidden = false;
    uploadSection.hidden = true;
    loginForm.reset();
  }

  // Check for an existing session on page load.
  client.auth.getSession().then(({ data }) => {
    if (data.session) showSignedIn(data.session);
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      loginError.textContent = error.message;
      return;
    }
    showSignedIn(data.session);
  });

  logoutBtn.addEventListener('click', async () => {
    await client.auth.signOut();
    showSignedOut();
  });

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    uploadError.textContent = '';
    uploadSuccess.textContent = '';

    const eventType = document.getElementById('photoEvent').value;
    const title = document.getElementById('photoTitle').value.trim();
    const caption = document.getElementById('photoCaption').value.trim();
    const file = document.getElementById('photoFile').files[0];

    if (!file) {
      uploadError.textContent = 'Please choose an image file.';
      return;
    }

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading…';

    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadErr } = await client.storage.from(BUCKET).upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(path);
      const imageUrl = urlData.publicUrl;

      const { error: insertErr } = await client
        .from('gallery_images')
        .insert([{ title, caption, image_url: imageUrl, event_type: eventType }]);
      if (insertErr) throw insertErr;

      uploadSuccess.textContent = 'Photo uploaded! It will now show on the gallery page.';
      uploadForm.reset();
      loadPhotos();
    } catch (err) {
      uploadError.textContent = err.message || 'Something went wrong uploading that photo.';
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload photo';
    }
  });

  async function loadPhotos(){
    photoList.innerHTML = '<p class="admin-empty">Loading photos…</p>';
    const { data, error } = await client
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      photoList.innerHTML = `<p class="admin-empty">Couldn't load photos: ${error.message}</p>`;
      return;
    }
    if (!data || data.length === 0) {
      photoList.innerHTML = '<p class="admin-empty">No photos uploaded yet.</p>';
      return;
    }

    photoList.innerHTML = '';
    data.forEach(photo => {
      const row = document.createElement('div');
      row.className = 'admin-photo-row';
      row.innerHTML = `
        <img src="${photo.image_url}" class="admin-photo-thumb" alt="">
        <div class="admin-photo-info">
          <div class="admin-photo-title">${photo.title || '(untitled)'}</div>
          <div class="admin-photo-caption">${photo.caption || ''}</div>
          <span class="admin-photo-event">${photo.event_type || 'Uncategorized'}</span>
        </div>
        <button class="admin-delete-btn" data-id="${photo.id}" data-url="${photo.image_url}">Delete</button>
      `;
      photoList.appendChild(row);
    });

    photoList.querySelectorAll('.admin-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Remove this photo from the gallery?')) return;
        const id = btn.dataset.id;
        const url = btn.dataset.url;
        const path = url.split(`${BUCKET}/`)[1];

        await client.from('gallery_images').delete().eq('id', id);
        if (path) await client.storage.from(BUCKET).remove([path]);
        loadPhotos();
      });
    });
  }
}
