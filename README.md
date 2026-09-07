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
- Simulates a mailbox by writing contact messages to SQLite (`contact_messages`)

## Run

```bash
cd server
npm install
npm start
```

Then open:
`http://localhost:3000`

## Mailbox Simulation (Admin)

Contact form submissions are stored in SQLite and viewable in Admin:

- Visit `/admin/mailbox` after logging in.
- Messages are marked read when opened.
- You can delete messages from the mailbox view.

## Notes

- The contact form posts JSON to the Node backend.
- Picsum images use seeded URLs with fixed dimensions for more stable results.
- Cards were tightened so most content blocks do not inherit oversized vertical space.

## Production Deploy (One Command)

On the droplet:

```bash
cd /var/www/mbw/server
npm run deploy:prod -- mbw
```

> **The directory is lowercase `mbw`, while this repo is `MBW`.** The lab980
> registry (`ivjames/lab980.com`, `.claude/sites.json`) records
> `dir: /var/www/mbw`, collected from the droplet, and notes the case
> difference explicitly. This page said `/var/www/MBW`, which does not exist on
> a case-sensitive filesystem — the `cd` fails and nothing deploys.
> Not re-checked on the box by this edit; if a `cd /var/www/mbw` there fails,
> `ls -d /var/www/[Mm][Bb][Ww]` settles it and the registry is what should be
> corrected.

Deploys are a separate step from merging: nothing here ships on a merge to
`main`. This site runs under **systemd** (`mbw.service`), not pm2, so it never
appears in `pm2 list`.

What it does:

- Installs dependencies with `npm ci`
- Builds minified bundles (`assets/js/main.min.js` and `assets/css/app.min.css`)
- Runs DB migrations (`npm run migrate`)
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
