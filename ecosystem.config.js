module.exports = {
  apps: [
    {
      name: "portfolio-guidotti",
      script: ".next/standalone/server.js",
      cwd: "/opt/portfolio-guidotti",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "256M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/opt/portfolio-guidotti/logs/error.log",
      out_file: "/opt/portfolio-guidotti/logs/out.log",
    },
  ],
};
