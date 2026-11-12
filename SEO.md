# SEO plan and log

## What is in place
- Page titles per page ("The Governor's office | Gladys Wanga, Governor of Homa Bay County"), set in `src/App.jsx`.
- `index.html`: description, Open Graph title and description, theme colour, and Person structured data (name, alternate name, job title, employer, social profiles).
- `public/robots.txt` (blocks `/admin`) and `public/sitemap.xml`.
- Plain, readable headings and real text on every page (no text inside images).

## To do when the domain is chosen
1. Replace `https://www.example.com` in `public/sitemap.xml`, and uncomment the Sitemap line in `public/robots.txt`.
2. Add `og:url`, a canonical link and an `og:image` (a 1200x630 card) to `index.html`.
3. Set `siteUrl` in `site.config.js`.
4. Verify the site in Google Search Console and submit the sitemap.

## Content that helps search
- Add a portrait photo and the office email and phone (dashboard). Real contact details are the strongest local signal.
- Keep News and Engagements up to date: each engagement has its own page (`/engagements/:id`).
- Link to the Assembly's own pages (already in Contact, "Other links").

## Log
- Initial build: titles, description, structured data, robots, sitemap.
