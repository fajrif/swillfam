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
(PM2 process config) and `deploy/nginx.conf.example` (reverse proxy config) used below.

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

```bash
cd /var/www
sudo git clone <your-repo-url> swillfam
sudo chown -R $USER:$USER swillfam
cd swillfam
npm ci
```

Create `/var/www/swillfam/.env` (never commit this):

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

### 7. Nginx

Check your `/etc/nginx/nginx.conf`'s `http {}` block first: if it already has
`include /etc/nginx/sites-enabled/*;`, you can use the sites-available/sites-enabled convention.
If it only has `include /etc/nginx/conf.d/*.conf;` (common on boxes carried over from an older/
CentOS-style setup, e.g. if a previous app's config lives directly in `nginx.conf`), drop the file
straight into `conf.d/` instead — no symlink needed, and it won't touch the legacy config:

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/conf.d/swillfam.conf
sudo nginx -t && sudo systemctl reload nginx
```

The example ships IP-only, no domain, no SSL (`listen 80 default_server; server_name _;`) — this
works immediately by visiting `http://your-server-ip`. Let's Encrypt can't issue a cert for a bare
IP, so there's no SSL step yet.

### 8. Once you have a domain: point DNS + SSL

Add an A record for your domain (and `www`) to the server's IP, then:

```bash
sudo nano /etc/nginx/conf.d/swillfam.conf   # replace `server_name _;` with your real domain(s)
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot rewrites the file in place to add the 443 block + HTTP→HTTPS redirect.

### Future deploys

```bash
cd /var/www/swillfam
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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
