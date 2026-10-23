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
      // Timestamp every log line, so an old error can be told from a new one.
      time: true,
      // Next + sharp legitimately peak above 500M while the image cache warms. A
      // cap that low had PM2 killing the app mid-write, which left 0-byte files
      // in .next/cache/images and then broke the image cache on every boot. The
      // host has ~3.8 GB.
      max_memory_restart: "1500M",
      env: {
        NODE_ENV: "production",
        // glibc hands each thread its own malloc arena; libvips (sharp) threads
        // fragment them and RSS only ever grows. Two arenas is the standard fix.
        MALLOC_ARENA_MAX: "2",
      },
      env_production: {
        NODE_ENV: "production",
        MALLOC_ARENA_MAX: "2",
      },
    },
  ],
};
