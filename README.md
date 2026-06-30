# Britni Window Empire × Angi Growth Review

A polished, interactive, customer-facing web presentation based on the first 13 slides of the Britni Window Empire Angi QBR deck.

## What is included

- `index.html` — the single-page interactive presentation
- `styles.css` — Angi/Britni-themed executive styling
- `app.js` — interactive charts, filters, scenario slider, and present mode
- `assets/` — optimized web images used in the presentation
- `vercel.json` — static-site rewrite support

## Deploy to Vercel through GitHub

1. Create a new GitHub repository.
2. Upload this folder's contents to the repo root.
3. In Vercel, choose **Add New Project** and import the repo.
4. Choose **Other** as the framework preset if prompted.
5. Leave the build command blank; this is a static site.
6. Deploy.

## Local preview

Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 3000
```

Then visit `http://localhost:3000`.

## Presentation controls

- Use the left navigation to jump between sections.
- Use **Present mode** for a cleaner presentation experience.
- In Present mode, use the left/right arrows or keyboard arrow keys to navigate.

## Note on external references

The Product Enablement section includes links to public Angi and ServiceTitan reference materials. Keep or replace those links based on the interview team's preference.
