/**
 * PM2 Ecosystem Configuration - Omnichannel UI
 * =============================================
 * Next.js frontend for memory ingestion and management
 *
 * IMPORTANT: Always run `npm run build` before starting in production mode!
 *
 * =============================================================================
 * LOCAL DEVELOPMENT (macOS)
 * =============================================================================
 *
 *   # Development mode (with hot reload):
 *   pm2 start ecosystem.config.js
 *
 *   # Production mode (serves built app):
 *   npm run build
 *   pm2 start ecosystem.config.js --env production
 *
 * =============================================================================
 * UBUNTU SERVER DEPLOYMENT
 * =============================================================================
 *
 *   # 1. Clone/pull repository
 *   cd /opt/omnichannel-ui
 *   git pull origin main
 *
 *   # 2. Install dependencies
 *   npm ci --production=false
 *
 *   # 3. Create production environment file
 *   cp .env.example .env.local
 *   nano .env.local  # Update URLs to production values
 *
 *   # 4. Build the application
 *   npm run build
 *
 *   # 5. Create logs directory
 *   mkdir -p logs
 *
 *   # 6. Start with PM2 (production mode)
 *   pm2 start ecosystem.config.js --env production
 *
 *   # 7. Save PM2 process list for auto-restart on reboot
 *   pm2 save
 *
 * =============================================================================
 * PORT: 3030 (both dev and production)
 * =============================================================================
 */

const path = require('path');

// Configuration
const SERVICE_NAME = 'omnichannel-ui';
const BASE_PATH = __dirname;
const PORT = 3030;

module.exports = {
  apps: [
    {
      name: SERVICE_NAME,
      cwd: BASE_PATH,

      // Use node directly with next start for production
      // PM2's --env flag sets NODE_ENV which we use to pick the right command
      script: 'node_modules/.bin/next',
      args: 'start -p 3030',

      // Environment-specific overrides
      env: {
        NODE_ENV: 'development',
        PORT: PORT,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: PORT,
      },

      // For development, we need to use 'npm run dev' instead
      // Use: pm2 start ecosystem.config.js --only omnichannel-ui-dev
      // (uncomment below block if needed)

      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,

      // Logging
      error_file: path.join(BASE_PATH, 'logs', 'error.log'),
      out_file: path.join(BASE_PATH, 'logs', 'out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Resource limits (Next.js can be memory-intensive with SSR)
      max_memory_restart: '1G',

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 30000,

      // Instance management
      instances: 1,
      exec_mode: 'fork',
    },

    // Development app (uncomment if you want PM2-managed dev server)
    // {
    //   name: 'omnichannel-ui-dev',
    //   cwd: BASE_PATH,
    //   script: 'npm',
    //   args: 'run dev',
    //   interpreter: 'none',
    //   env: {
    //     NODE_ENV: 'development',
    //     PORT: PORT,
    //   },
    //   autorestart: true,
    //   watch: false,
    //   max_restarts: 5,
    //   error_file: path.join(BASE_PATH, 'logs', 'dev-error.log'),
    //   out_file: path.join(BASE_PATH, 'logs', 'dev-out.log'),
    // },
  ],
};
