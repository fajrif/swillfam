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
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
