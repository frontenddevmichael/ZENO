# Zeno — Exact Setup Steps
## Do these in order. Every step. No skipping.

---

## Before anything else — tools you need installed

Open your terminal and check these exist:

```
node --version     should show v18 or higher
npm --version      should show v9 or higher
git --version      should show any version
```

If any of these fail, install them first:
- Node.js → nodejs.org → download the LTS version
- Git → git-scm.com → download for your OS

---

## Step 1 — Create the project

Open your terminal. Navigate to wherever you keep your projects. Then run:

```
npm create vite@latest zeno -- --template react
```

It will ask you nothing — the `--template react` flag handles it.
When it finishes, run:

```
cd zeno
npm install
npm run dev
```

Open your browser at `http://localhost:5173`
You should see the default Vite + React page.
If you see it — Step 1 is done.

---

## Step 2 — Delete the default files you don't need

Inside the `src` folder, delete these files:
- `App.css`
- `assets/react.svg`

Open `src/App.jsx` and delete everything inside it. Leave the file empty for now.
Open `src/index.css` and delete everything inside it. Leave the file empty for now.

You should now have a blank browser tab with no errors in the console.

---

## Step 3 — Create your folder structure

Inside the `src` folder, create these folders one by one.
They will all be empty for now — that's fine.

```
src/
  pages/
  components/
    ui/
    layout/
    product/
    home/
    checkout/
  hooks/
  store/
  lib/
  styles/
```

On Mac/Linux you can run this from inside the `src` folder:
```
mkdir pages store hooks lib styles
mkdir -p components/ui components/layout components/product components/home components/checkout
```

On Windows, create them manually in your file explorer or VS Code sidebar.

---

## Step 4 — Install your dependencies

Stop the dev server first (Ctrl+C in the terminal). Then run:

```
npm install react-router-dom
npm install zustand
npm install @supabase/supabase-js
npm install clsx
```

Install them one line at a time so you can see if any fail.
When done, run `npm run dev` again to make sure everything still works.

---

## Step 5 — Get your fonts

**Satoshi:**
1. Go to `fontshare.com`
2. Search "Satoshi"
3. Click Download
4. Open the zip file
5. Find the file called `Satoshi-Variable.woff2`
6. Copy it into `public/fonts/` (create the `fonts` folder inside `public` first)

**JetBrains Mono:**
1. Go to `fonts.google.com`
2. Search "JetBrains Mono"
3. Click "Get font" then "Download all"
4. Open the zip file
5. Find `JetBrainsMono-Regular.woff2` inside the `static` folder
6. Copy it into `public/fonts/`

You should now have:
```
public/
  fonts/
    Satoshi-Variable.woff2
    JetBrainsMono-Regular.woff2
```

---

## Step 6 — Set up your CSS files

**First — rename `src/index.css` to `src/styles/main.css`**
Move it into the styles folder you created. Then update the import in `src/main.jsx` to point to the new location:

Change this line:
```
import './index.css'
```
To:
```
import './styles/main.css'
```

**Second — put your token file in place**
Take the `zeno-tokens.css` file from this project package and copy it into `src/styles/`.

**Third — open `src/styles/main.css` and add this content:**

```css
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@import './zeno-tokens.css';
```

Save. Go to your browser. Open DevTools (F12). Go to the Network tab. Reload the page.
Filter by "Font". You should see both font files loading.
If they load — Step 6 is done.

---

## Step 7 — Set up Supabase

**Create your account and project:**
1. Go to `supabase.com`
2. Sign up with GitHub (easiest)
3. Click "New Project"
4. Give it the name: `zeno`
5. Set a database password — save it somewhere safe
6. Choose a region — `West EU (Ireland)` is closest to Nigeria with good latency
7. Click "Create new project"
8. Wait about 2 minutes for it to set up

**Create your tables:**
1. In the left sidebar, click "SQL Editor"
2. Click "New query"
3. Paste in this SQL exactly:

```sql
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  price       integer not null,
  category    text not null,
  brand       text,
  images      text[],
  specs       jsonb,
  stock       integer default 0,
  is_featured boolean default false,
  created_at  timestamptz default now()
);

create table orders (
  id           uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  items        jsonb not null,
  total        integer not null,
  status       text default 'pending_whatsapp',
  shipping     jsonb,
  created_at   timestamptz default now()
);

alter table products enable row level security;
create policy "Products are public"
  on products for select using (true);
```

4. Click "Run"
5. You should see "Success. No rows returned."

**Add a test product:**
1. In the left sidebar click "Table Editor"
2. Click on "products"
3. Click "Insert row"
4. Fill in these fields:
   - name: `iPhone 15 Pro`
   - slug: `iphone-15-pro`
   - price: `72000000` (₦720,000 in kobo — always multiply by 100)
   - category: `phones`
   - stock: `10`
   - is_featured: toggle to true
5. Click Save

**Get your API keys:**
1. In the left sidebar click "Project Settings" (the gear icon)
2. Click "API"
3. You'll see two values you need:
   - Project URL — looks like `https://xxxxxxxxxxxx.supabase.co`
   - anon public key — a long string starting with `eyJ`
4. Copy both. You'll use them in the next step.

---

## Step 8 — Create your environment file

In the root of your project (same level as `package.json`, not inside `src`), create a new file called `.env.local`

Open it and add:
```
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
VITE_WHATSAPP_NUMBER=2348012345678
```

For the WhatsApp number — use your Nigerian number in international format.
`08012345678` becomes `2348012345678`
(replace the leading 0 with 234)

**Immediately open `.gitignore`** (it's in your project root, created by Vite automatically).
Check that `.env.local` is listed in it. It should already be there — Vite adds it automatically. If it's not there for some reason, add it manually on its own line.

Stop and restart your dev server after adding environment variables:
```
Ctrl+C
npm run dev
```

---

## Step 9 — Create the Supabase client file

Create a new file: `src/lib/supabase.js`

It should import the Supabase SDK and export one client instance using your environment variables. That's it. Every other file that needs Supabase imports from this one file.

Test it by opening your browser console and checking there are no import errors when the page loads.

---

## Step 10 — Set up routing

Install React Router (already done in Step 4). Now set it up.

Open `src/main.jsx`. It currently imports and renders `<App />`.
Wrap `<App />` with `<BrowserRouter>` from `react-router-dom`.

Open `src/App.jsx`.
Import `Routes` and `Route` from `react-router-dom`.
Add a `<Routes>` block with one route for now: path `/` pointing to a placeholder component that just returns a `<div>` with the text "Homepage coming soon".

Save. Go to your browser at `http://localhost:5173`.
You should see "Homepage coming soon".
Go to `http://localhost:5173/shop`.
You should see a blank page (not an error) — the route doesn't exist yet, which is expected.

---

## Step 11 — Verify your font is working

Open `src/App.jsx`.
Make your placeholder show some text styled with your token:

Write a small inline style that sets `font-family` to `var(--font-sans)` and check in the browser that the text renders in Satoshi, not the browser default.

You can verify by opening DevTools → Elements → click the text → check Computed styles → look for the font-family value. It should show `Satoshi`.

If it's showing `system-ui` or something else, your font face declarations in `main.css` have an error — go back to Step 6.

---

## Step 12 — Verify Supabase is connected

In `src/App.jsx`, temporarily add a `useEffect` that imports your Supabase client and calls `.from('products').select('*')`. Log the result to the console.

Open the browser console. You should see an array containing the test product you added in Step 7.

If you see an empty array — check your RLS policy was created correctly.
If you see an error — check your environment variable names have the `VITE_` prefix and that you restarted the dev server after adding them.

Once you see the product data in the console — remove this test code. You've confirmed the connection works.

---

## Step 13 — Create `vercel.json`

Create a file in your project root (same level as `package.json`) called `vercel.json`.

It needs one rewrite rule that tells Vercel to always serve your `index.html` regardless of the URL. This is what makes client-side routing work after deployment — without it, refreshing on any page except `/` returns a 404.

Look up "vercel.json SPA rewrite" if you're unsure of the exact format. It's three lines.

---

## Step 14 — Push to GitHub

If you don't have a GitHub account, create one at `github.com`.

In your terminal, from the project root:

```
git init
git add .
git commit -m "project setup complete"
```

Then:
1. Go to `github.com`
2. Click the `+` icon → New repository
3. Name it `zeno`
4. Leave it private
5. Don't add a README (you already have files)
6. Click Create repository
7. GitHub will show you commands — copy and run the ones under "push an existing repository"

Go to your GitHub repo in the browser. You should see all your files there.

---

## You are now ready to build.

Every one of these is confirmed working:
- Vite dev server runs at localhost:5173
- Folder structure is in place
- Both fonts load correctly
- CSS tokens are imported globally
- React Router is set up with a working route
- Supabase returns data from your products table
- Environment variables are set and working
- Git is set up and pushed to GitHub
- vercel.json is in place for deployment

Start with the Navbar component. Everything else builds on top of this foundation.

---

*Zeno Setup Guide — complete before building any component*
