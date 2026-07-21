This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production Deployment

Self-hosted on Ubuntu 24 with Nginx + PM2 (not Vercel). Repo includes `ecosystem.config.js`
(PM2 process config), `deploy/nginx-main.conf.example` (base `nginx.conf`), and
`deploy/nginx.conf.example` (the swillfam vhost) used below.

### 1. Dump your current database (local machine)

```bash
pg_dump -Fc --no-owner --no-acl -d swillfam_db -f swillfam.dump
scp swillfam.dump youruser@your-server-ip:/tmp/swillfam.dump
```

### 2. Server prep (Ubuntu 24)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git ufw

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 3. Create the DB + role, then restore

```bash
sudo -u postgres psql -c "CREATE ROLE swillfam WITH LOGIN PASSWORD 'STRONG_PASSWORD_HERE';"
sudo -u postgres psql -c "CREATE DATABASE swillfam_db OWNER swillfam;"
pg_restore --no-owner --no-acl -d swillfam_db -U swillfam -h localhost -W /tmp/swillfam.dump
```

If the connection fails on auth, Postgres is likely set to `peer` auth locally — edit
`/etc/postgresql/*/main/pg_hba.conf`, set the `local`/`127.0.0.1` lines to `scram-sha-256`, then
`sudo systemctl restart postgresql`.

### 4. Get the app onto the server

Any directory works here (Next.js/PM2 don't care where the project lives — see "Where should the
code live?" below); these steps assume the `deployer` user's home, matching the rest of this guide.

```bash
cd /home/deployer
git clone <your-repo-url> swillfam
cd swillfam
npm ci
```

Create `/home/deployer/swillfam/.env` (never commit this):

```bash
DATABASE_URL="postgresql://swillfam:STRONG_PASSWORD_HERE@localhost:5432/swillfam_db"
ADMIN_SESSION_SECRET="<output of: openssl rand -base64 32>"
ADMIN_EMAIL="you@yourcompany.com"
ADMIN_PASSWORD="choose-a-strong-password"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.xxxxx"
```

`public/uploads/*` is gitignored and never comes from `git clone` — if your dump references
uploaded images, also sync your local `public/uploads/` directory to the same path on the server,
and make sure nothing wipes it on later deploys.

**Where should the code live?** Doesn't matter to Next.js/PM2 — `npm run build` produces `.next/`,
not a portable `dist/`, and it has to stay next to `node_modules/` + `public/` in one project
directory (this app isn't a static export; it needs a running Node process for Server Actions,
Prisma, and the admin middleware). `ecosystem.config.js` uses `cwd: __dirname`, so it runs from
wherever you cloned it. `/home/deployer` works because nginx only reverse-proxies to
`127.0.0.1:3000` and never reads the app's files directly — the only requirement is that the user
running `pm2 start` (here, `deployer`) owns the directory and can write to `public/uploads/`.

### 5. Migrate, generate, seed admin, build

```bash
npx prisma generate
npx prisma migrate deploy      # applies any migrations not already in the dumped DB
npx tsx prisma/seed-admin.ts   # only if the dump didn't already include your admin user
npm run build
```

### 6. Run it with PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # run the systemd command it prints, once
```

`pm2 logs swillfam` to tail logs, `pm2 restart swillfam` after future deploys.

### 7. Nginx (sites-available/sites-enabled)

If `/etc/nginx/nginx.conf` is a stock install, it already has `include /etc/nginx/sites-enabled/*;`
and you can skip straight to the vhost. If it's been customized (e.g. carried over from an older
CentOS-style setup where a previous app's server blocks lived directly in `nginx.conf`), replace it
with the clean base first:

```bash
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
sudo cp deploy/nginx-main.conf.example /etc/nginx/nginx.conf
```

Then add the vhost:

```bash
sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/swillfam
sudo ln -s /etc/nginx/sites-available/swillfam /etc/nginx/sites-enabled/swillfam

# Stock Ubuntu ships sites-enabled/default with its own `default_server` on :80 —
# only one is allowed per port, so remove the symlink (the template stays behind
# at sites-available/default if you ever want it back).
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx
```

The vhost ships IP-only, no domain, no SSL (`listen 80 default_server; server_name _;`) — this
works immediately by visiting `http://your-server-ip`. Let's Encrypt can't issue a cert for a bare
IP, so there's no SSL step yet.

### 8. Once you have a domain: point DNS + SSL

Add an A record for your domain (and `www`) to the server's IP, then:

```bash
sudo nano /etc/nginx/sites-available/swillfam   # replace `server_name _;` with your real domain(s)
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot rewrites the file in place to add the 443 block + HTTP→HTTPS redirect.

Once HTTPS is confirmed working, flip the admin session cookie back to secure:

```bash
# in /home/deployer/swillfam/.env
COOKIE_SECURE="true"
```

```bash
pm2 restart swillfam --update-env
```

(`--update-env` is required — PM2 otherwise keeps the environment it captured at the last
`pm2 start`.) Skipping this step is harmless before SSL is live (the app already defaults to
`COOKIE_SECURE=false`/unset), but leaving it unset after HTTPS is up means the admin session
cookie is sent over plain HTTP too, which it shouldn't be.

### Future deploys

```bash
cd /home/deployer/swillfam
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart swillfam
```

### Pre-launch checklist

- `ADMIN_SESSION_SECRET` is a real random value, not left as a placeholder.
- `public/uploads/` and the database are backed up on a schedule (`pg_dump`, `rsync`, etc.).
- Sessions are stateless JWTs with no DB-side revocation — rotating `ADMIN_SESSION_SECRET` is the
  only way to force-invalidate all admin sessions if a cookie ever leaks.

### Troubleshooting

**Large images / JS chunks fail with `ERR_CONTENT_LENGTH_MISMATCH` or
`ERR_INCOMPLETE_CHUNKED_ENCODING` (small assets load fine).**

Root cause: nginx buffers any upstream response bigger than its in-memory buffers to a temp file
under `/var/lib/nginx/`, and it couldn't write there — the error log shows
`open() "/var/lib/nginx/proxy/..." failed (13: Permission denied) while reading upstream`. This
happens when nginx's working dirs are owned by a different user than the one nginx runs as (e.g. a
box converted from an older setup where nginx ran as `deployer`/`nginx`, then switched to the
standard `user www-data;`). Small responses stay in memory and work; large ones must spill to the
unwritable temp dir and get truncated.

Confirm and fix:

```bash
sudo tail -50 /var/log/nginx/error.log        # look for "/var/lib/nginx/..." Permission denied
sudo chown -R www-data:www-data /var/lib/nginx  # hand the dirs to the user nginx runs as
sudo systemctl reload nginx
```

Diagnostic tip: a fast reader like `curl` on the server drains nginx's memory buffers before they
spill to disk, so `curl http://127.0.0.1/<asset>` returns the full file even while real (slower)
browsers truncate — a full loopback download does **not** rule this out. `ip -s link show eth0`
(TX errors `0`) and a matching `Content-Length` confirm it's not a network/NIC/MTU problem.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
