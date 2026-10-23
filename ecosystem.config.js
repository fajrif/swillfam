// PM2 process manager config for production.
// Usage: pm2 start ecosystem.config.js --env production
module.exports = {
  apps: [
    {
      name: "swillfam",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      // Next + sharp (AVIF encoding) legitimately peaks above 500M. A cap that low
      // had PM2 killing the app mid-write, which left 0-byte files in
      // .next/cache/images and then broke the image cache on every boot.
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
