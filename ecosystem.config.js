/**
 * PM2 Ecosystem Configuration - Omnichannel UI
 * =============================================
 * Next.js frontend for memory ingestion and management
 *
 * Prerequisites:
 *   npm install
 *   npm run build  # For production
 *
 * Usage (Development):
 *   pm2 start ecosystem.config.js
 *
 * Usage (Production):
 *   npm run build
 *   pm2 start ecosystem.config.js --env production
 *
 * Port: 3030 (both dev and production)
 */

const path = require('path');

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';
const isUbuntu = process.platform === 'linux';

// Configuration
const SERVICE_NAME = 'omnichannel-ui';
const BASE_PATH = isUbuntu
  ? '/opt/circles/omnichannel-ui'
  : '/Users/paruljuniwal/kuzushi_labs/circles_aditya/omnichannel-ui';

const PORT = 3030;

module.exports = {
  apps: [
    {
      name: SERVICE_NAME,
      cwd: BASE_PATH,
      script: 'npm',
      args: isProduction ? 'run start' : 'run dev',
      interpreter: 'none',

      // Environment
      env: {
        NODE_ENV: 'development',
        PORT: PORT,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: PORT,
      },

      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,

      // Logging
      error_file: `${BASE_PATH}/logs/error.log`,
      out_file: `${BASE_PATH}/logs/out.log`,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Resource limits
      max_memory_restart: '1G',

      // Graceful shutdown
      kill_timeout: 5000,
    },
  ],
};
