# ACYA — African Church Youth Association

Official website for the African Church Youth Association (ACYA) — "ACYA................ For Christ !!!"

A responsive site built with plain HTML, CSS and JavaScript — no build step, no framework. The gallery can optionally connect to a free [Supabase](https://supabase.com) project so photos can be uploaded from a simple admin page instead of editing code.

## Project structure

```
acya-website/
├── index.html            # Main page (About, Events, Gallery, Contact)
├── admin.html             # Gallery admin — sign in and upload photos
├── setup.sql               # Run once in Supabase to create the gallery table
├── css/
│   ├── styles.css        # Main site styling — blue / gold / red, Poppins type
│   └── admin.css          # Admin page styling
├── js/
│   ├── script.js           # Mobile nav, events tabs, lightbox
│   ├── gallery.js           # Loads real photos from Supabase (falls back to placeholders)
│   ├── admin.js              # Admin login, upload, delete
│   └── supabase-config.js     # Your Supabase project keys go here
├── assets/
│   └── acya-logo.png     # Official ACYA crest (logo & favicon)
└── README.md
```

## Running locally

```bash
python3 -m http.server 8000     # or: npx serve .
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Source**, choose the branch (e.g. `main`) and root folder (`/`).
4. Save — your site is live at `https://<username>.github.io/<repo-name>/`.

## Updating event dates

Event details live in `index.html` inside the `#events` section — two panels, `panelNext` and `panelLast`. Edit the text directly.

---

## Setting up live photo uploads (Supabase)

This lets you upload real event photos through a simple admin page — `admin.html` — instead of editing code each time. It takes about 10 minutes to set up, once.

**1. Create a Supabase project**
Go to [supabase.com](https://supabase.com), sign up (free), and click "New project". Give it any name and a database password (save that password somewhere safe).

**2. Run the setup script**
In your Supabase project, open **SQL Editor → New query**, paste in everything from `setup.sql` in this folder, and click **Run**. This creates the `gallery_images` table and the permissions that let visitors *view* photos but only a signed-in admin *add or remove* them.

**3. Create the photo storage bucket**
Go to **Storage → New bucket**. Name it exactly `gallery-photos` and turn **Public bucket** ON. Save.

**4. Create your admin login**
Go to **Authentication → Users → Add user**, and create yourself an account with an email and password. This is what you'll use to sign in to `admin.html`.

**5. Copy your project keys**
Go to **Project Settings → API**. Copy the **Project URL** and the **anon public** key.

**6. Fill in `js/supabase-config.js`**
Open that file and replace the two placeholder values:
```js
const SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
```
Commit and push this change to GitHub (or redeploy on Vercel).

**7. Upload photos**
Visit `yoursite.com/admin.html`, sign in with the account from step 4, and upload a photo — pick which **event** it belongs to (National Convention / NEC Meeting / National Conference), add a title and caption, and upload. It appears in that event's section on the main gallery automatically — no further deploys needed.

**Note:** `admin.html` isn't linked from the main site's navigation, but it isn't private on its own — anyone who knows the URL can reach the *login screen* (they still need your password to actually upload or delete anything). That's expected and safe.

### If you already set up Supabase before this update

You only need to do two things:
1. In **SQL Editor**, run this one line to add the new "event" field to your existing table:
   ```sql
   alter table gallery_images add column if not exists event_type text;
   ```
2. Replace `index.html`, `admin.html`, `css/styles.css`, `css/admin.css`, `js/script.js`, `js/gallery.js` and `js/admin.js` in your GitHub repo with the new versions from this zip. Your `js/supabase-config.js` (with your real keys already filled in) does **not** need to change — leave that file as it is.

## Credits

Crest/logo: The African Church Youth Association, established 13th October 1901.
