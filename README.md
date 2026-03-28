# Buzzworthy Demo Site + Node Backend

Static multipage frontend with a small Node backend for contact form demo submissions.

## Pages
- `index.html`
- `services.html`
- `about.html`
- `contact.html`

## Backend
- `server/server.js`
- `POST /api/contact`
- Demo mode only: submissions are logged to the Node console

## Run
```bash
cd server
npm install
npm start
```

Then open:
`http://localhost:3000`

## Notes
- The contact form posts JSON to the Node backend.
- Picsum images use seeded URLs with fixed dimensions for more stable results.
- Cards were tightened so most content blocks do not inherit oversized vertical space.


Update: fixed missing About/Contact hero images and tightened subpage hero spacing.
