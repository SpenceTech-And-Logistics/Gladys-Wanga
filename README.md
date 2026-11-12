# Gladys Wanga, Governor of Homa Bay County: official website

Multi-page React + Vite site for the Governor of Homa Bay County, with an admin dashboard at `/admin`.
Built by SpenceTec and Logistics Limited.

**Public pages:** Home, About, The Office (functions of the Governor and the county executive), The County, Positions, Engagements (with detail pages), News, Gallery, Contact.

**Dashboard (`/admin`):** Overview (counts, checklist, latest messages and changes), Profile and career, The Governor's office, Homa Bay County, Positions, Engagements, News and press, Gallery, Messages, Contact and social links. Photos upload from the dashboard; CSV/JSON import for Engagements, News and Positions.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # output in dist/
```

### Try the dashboard without Firebase
```bash
VITE_DEMO_DASHBOARD=1 npm run dev        # then open /admin
```
This swaps Firebase for an in-memory copy with a few sample messages, so the dashboard can be shown to the client. Nothing is saved, and it is not part of a normal build.

## Content and sources
The built-in content comes only from these public sources. Anything they did not say is left blank for the office to fill in.
- Wikipedia (Gladys Wanga): birth, education, offices, 25 August 2022 start as Governor, Deputy Governor Danish Otieno Onyango, one of seven women governors elected in 2022.
- Parliament of Kenya member profile: committees (Parliamentary Service Commission, House Business Committee, Labour and Social Welfare, Finance and National Planning), education, work history.
- EJS Center profile: first woman Woman Representative for Homa Bay (2013), unopposed in 2017, ODM roles, Azimio 2022, advocacy.
- Mzalendo: party, student politics, family background.
- County facts (eight sub-counties, 2019 population, county code 43) come from the Kenya 2019 census and IEBC constituencies, not from the links supplied. Please confirm them.
- Facebook, X, Instagram and the KEWOPA page could not be read, so they are linked only. The sponyo12/Gladys-Wanga GitHub repository could not be reached, so nothing was taken from it.

**To confirm with the office:** the sources disagree on when her Woman Representative term started (2013 on Parliament and EJS, 2017 in the Wikipedia infobox); the site says 2013 to 2022. The Mzalendo phone number (0721441024) dates from her Woman Representative campaign and is **not** shown. Office email and phone, the county executive names, programme figures and a portrait are all blank for the office to add.

**Images:** the Homa Bay County coat of arms is in `public/brand/`. Wherever there is no photo yet, the Coat of Arms of Kenya is shown. Upload an official portrait from the dashboard (Profile and career) or put `portrait.jpg` in `src/assets/images/`. The crest files are small (about 150px); ask for a larger copy for print.

Once Firebase is connected, anything saved in the dashboard replaces the built-in version.

## Dashboard features
- **Engagements are part of Events** (types County leadership, Parliament, Party and campaigns); `/engagements` links redirect to `/events`. If anything was saved under the old Engagements section, **Fill the database → Move into Events** moves it across.
- **Positions** are a section of the About page (`/about#positions`); `/positions` redirects there.
- **Projects** and **Events**: public pages at `/projects` (tabs by funder, sector chips, status and sub-county filters) and `/events` (upcoming, then past events by year), each with a detail page, photos, optional video and a Share on WhatsApp button.
- **Import from WhatsApp** (`/admin/whatsapp`): drop the zip or photos the team sent and paste their note (“-ward…”, “-stretch of…”, “-works done…”). The form fills itself in; pick the cover and save as a project, event or news story. Extra photos go to the Gallery. Videos are skipped (paste a YouTube/Facebook link instead).
- **Categories** (`/admin/categories`): funders, sectors, event types and other lists. “＋ Add a new…” in any form also adds to these.
- **Filters** on every list: tabs, category chips, search, Published/Draft/Built-in.
- **Add many photos** to the Gallery in one go.
- **Fill the database** (`/admin/database`): copies built-in content into Firebase. Anything the office deletes is remembered in `site/hidden` and does not come back.
- **Site ↔ dashboard links**: “Office sign in” in the footer; after an administrator signs in, the public site shows an “Edit this page / Dashboard / + Add” bar and Edit buttons on projects, events and news. Every dashboard section has “See this on the website” and per-item View links.
- **Office WhatsApp number** (Contact and social links): shows a Chat on WhatsApp button on the Contact page and footer.

After pulling these changes, **republish `firestore.rules`** in the Firebase console (it now includes `projects` and `events`).

## Firebase setup (free Spark plan, no Storage needed)
1. Firebase console: create a project, then Build, Firestore Database, create (production mode).
2. Build, Authentication, Sign-in method: enable **Email/Password**. Add the office users under Users.
3. Project settings, Your apps, add a **Web app**. Copy `apiKey`, `authDomain`, `projectId`, `appId` into `site.config.js`.
4. Firestore, Rules: paste the contents of `firestore.rules` and Publish.
5. Make someone an administrator: Firestore, start collection `admins`, document ID = that user's **UID** (shown on the "No access" screen after they sign in), field `ok` = boolean `true`.
6. Authentication, Settings, Authorized domains: add the live domain and the `*.workers.dev` address.
7. Redeploy. Open `/admin`.

## Deploy to Cloudflare Workers

**Option A: connect the GitHub repo (deploys on every push)**
Cloudflare dashboard → Workers & Pages → Create → Import a repository → `SpenceTech-And-Logistics/Gladys-Wanga`, then:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/` · Production branch: `main`
- Leave `VITE_DEMO_DASHBOARD` unset in production (set it to `1` only on a preview build to show the demo dashboard).

**Option B: from your computer**
```bash
npm install
npx wrangler login
npm run deploy        # builds, then wrangler deploy
```

`wrangler.jsonc` serves `dist/` with single-page-app fallback, so `/about`, `/admin` etc. work on refresh. `public/_headers` adds long caching for hashed assets, basic security headers and `noindex` on `/admin`.

After the first deploy: add the custom domain under the Worker's Settings → Domains & Routes, add that domain and the `*.workers.dev` address to Firebase Authorized domains, and replace `https://www.example.com` in `public/sitemap.xml` and `public/robots.txt`. See `SEO.md`.
