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

## Production Deploy (One Command)
On the droplet:

```bash
cd /var/www/MBW/server
npm run deploy:prod -- mbw
```

What it does:
- Installs dependencies with `npm ci`
- Builds minified bundles (`assets/js/main.min.js` and `assets/css/app.min.css`)
- Restarts the service (`systemctl restart mbw` by default)

If your service has a different name, pass it as the argument:

```bash
npm run deploy:prod -- your-service-name
```

## Optional Nginx Compression
Compression snippet is provided at:
- `deploy/nginx/mbw-performance.conf`

To apply:
1. Include the snippet in the `http {}` block of `/etc/nginx/nginx.conf`
2. Test config: `sudo nginx -t`
3. Reload: `sudo systemctl reload nginx`

The snippet enables gzip and includes an optional Brotli block (commented out unless your nginx build supports Brotli).


Update: fixed missing About/Contact hero images and tightened subpage hero spacing.
