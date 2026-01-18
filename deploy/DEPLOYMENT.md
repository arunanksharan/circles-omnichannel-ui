# Omnichannel UI - Deployment Guide

## Overview

This guide covers deploying the Omnichannel UI (Next.js 16) to an Ubuntu server with PM2 process management and Nginx reverse proxy.

**Target URL:** https://omni-ui.kuzushilabs.xyz

---

## Prerequisites

### Server Requirements

| Component | Version | Purpose |
|-----------|---------|---------|
| Ubuntu | 22.04+ | Operating system |
| Node.js | 20.x LTS | Runtime |
| npm | 10.x+ | Package manager |
| PM2 | 5.x+ | Process manager |
| Nginx | 1.18+ | Reverse proxy |
| Certbot | Latest | SSL certificates |

### Backend Dependencies

The UI connects to these services (ensure they're running):

| Service | Port | Purpose |
|---------|------|---------|
| circles-memory-service | 8001 | Memory ingestion API |
| graphiti-service | 9011 | Knowledge graph API |

---

## Local Development

### Quick Start

```bash
# Clone repository
git clone <repository-url> omnichannel-ui
cd omnichannel-ui

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your backend URLs

# Run development server
npm run dev

# Access at http://localhost:3030
```

### Build Verification

Always verify the build works before deployment:

```bash
# Build production bundle
npm run build

# Test production server locally
npm run start

# Access at http://localhost:3030
```

---

## Server Deployment

### Step 1: Prepare the Server

```bash
# SSH into server
ssh user@your-server

# Install Node.js 20.x (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be 20.x
npm --version   # Should be 10.x

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (if not installed)
sudo apt install nginx -y

# Install Certbot (if not installed)
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Deploy Application Code

```bash
# Create application directory
sudo mkdir -p /opt/omnichannel-ui
sudo chown $USER:$USER /opt/omnichannel-ui

# Clone repository
cd /opt
git clone <repository-url> omnichannel-ui
cd omnichannel-ui

# Or if already cloned, pull latest
cd /opt/omnichannel-ui
git pull origin main
```

### Step 3: Install Dependencies

```bash
cd /opt/omnichannel-ui

# Install all dependencies (including devDependencies for build)
npm ci --production=false

# This is required because:
# - @types/* packages are needed for TypeScript compilation
# - tailwindcss and postcss are needed for CSS processing
```

### Step 4: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with production values
nano .env.local
```

**Production .env.local:**

```bash
# =============================================================================
# Circles.co Omnichannel UI - Production Environment
# =============================================================================

# Backend Service URLs (Production)
NEXT_PUBLIC_MEMORY_SERVICE_URL=https://memory.kuzushilabs.xyz
NEXT_PUBLIC_GRAPHITI_URL=https://graphiti.kuzushilabs.xyz

# Or if using internal network
# NEXT_PUBLIC_MEMORY_SERVICE_URL=http://127.0.0.1:8001
# NEXT_PUBLIC_GRAPHITI_URL=http://127.0.0.1:9011

# Feature Flags
NEXT_PUBLIC_DEFAULT_MOCK_MODE=false
```

### Step 5: Build Application

```bash
cd /opt/omnichannel-ui

# Build the Next.js application
npm run build

# Verify build output
ls -la .next/
# Should see: standalone/, static/, server/, etc.
```

### Step 6: Create Logs Directory

```bash
mkdir -p /opt/omnichannel-ui/logs
```

### Step 7: Start with PM2

```bash
cd /opt/omnichannel-ui

# Start in production mode
pm2 start ecosystem.config.js --env production

# Verify it's running
pm2 list
pm2 logs omnichannel-ui --lines 20

# Save PM2 process list for auto-restart on reboot
pm2 save

# Setup PM2 startup script (if not already done)
pm2 startup systemd
# Follow the command it outputs
```

### Step 8: Configure Nginx

```bash
# Copy nginx config
sudo cp /opt/omnichannel-ui/deploy/nginx/omni-ui.kuzushilabs.xyz /etc/nginx/sites-available/

# Create symlink
sudo ln -s /etc/nginx/sites-available/omni-ui.kuzushilabs.xyz /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 9: Configure SSL with Certbot

```bash
# Obtain and configure SSL certificate
sudo certbot --nginx -d omni-ui.kuzushilabs.xyz

# Follow the prompts:
# - Enter email for renewal notices
# - Agree to terms
# - Choose redirect HTTP to HTTPS (recommended)

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Step 10: Configure DNS

Add an A record in your DNS provider:

| Type | Name | Value |
|------|------|-------|
| A | omni-ui | `<your-server-ip>` |

Or if using a CNAME:

| Type | Name | Value |
|------|------|-------|
| CNAME | omni-ui | kuzushilabs.xyz |

---

## Verification

### Test the Deployment

```bash
# Check PM2 status
pm2 status

# Check nginx status
sudo systemctl status nginx

# Test local access
curl -I http://localhost:3030

# Test through nginx
curl -I http://omni-ui.kuzushilabs.xyz

# Test HTTPS (after certbot)
curl -I https://omni-ui.kuzushilabs.xyz
```

### Access the Application

Open in browser: https://omni-ui.kuzushilabs.xyz

---

## Operations

### View Logs

```bash
# PM2 logs (real-time)
pm2 logs omnichannel-ui

# PM2 logs (last 100 lines)
pm2 logs omnichannel-ui --lines 100

# Application log files
tail -f /opt/omnichannel-ui/logs/out.log
tail -f /opt/omnichannel-ui/logs/error.log

# Nginx logs
sudo tail -f /var/log/nginx/omni-ui.access.log
sudo tail -f /var/log/nginx/omni-ui.error.log
```

### Restart Application

```bash
# Graceful restart
pm2 restart omnichannel-ui

# Hard restart (stop + start)
pm2 stop omnichannel-ui
pm2 start omnichannel-ui
```

### Update Deployment

```bash
cd /opt/omnichannel-ui

# Pull latest code
git pull origin main

# Install any new dependencies
npm ci --production=false

# Rebuild
npm run build

# Restart PM2
pm2 restart omnichannel-ui

# Verify
pm2 logs omnichannel-ui --lines 20
```

### Stop Application

```bash
pm2 stop omnichannel-ui
```

### Remove from PM2

```bash
pm2 delete omnichannel-ui
pm2 save
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs omnichannel-ui --lines 50

# Common issues:
# 1. Build not run - run: npm run build
# 2. Missing .env.local - copy from .env.example
# 3. Port in use - check: lsof -i :3030
```

### 502 Bad Gateway

```bash
# Check if PM2 app is running
pm2 status

# Check if port 3030 is listening
sudo lsof -i :3030

# Check nginx error log
sudo tail -f /var/log/nginx/omni-ui.error.log
```

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next/

# Clear node_modules and reinstall
rm -rf node_modules/
npm ci --production=false

# Retry build
npm run build
```

### Memory Issues

```bash
# Check memory usage
pm2 monit

# If app keeps restarting due to memory:
# Edit ecosystem.config.js to increase max_memory_restart
# Or add more server RAM
```

---

## Architecture Reference

```
                    ┌─────────────────┐
                    │   DNS/Cloudflare│
                    │omni-ui.kuzushi..│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     Nginx       │
                    │    :80/:443     │
                    │  (SSL termination)
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Next.js (PM2)  │
                    │     :3030       │
                    │ omnichannel-ui  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────▼────────┐  ┌────▼────┐  ┌───────▼───────┐
   │ Memory Service  │  │ Graphiti│  │   Static      │
   │     :8001       │  │  :9011  │  │   Assets      │
   └─────────────────┘  └─────────┘  └───────────────┘
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run build` | Build production bundle |
| `pm2 start ecosystem.config.js --env production` | Start with PM2 |
| `pm2 restart omnichannel-ui` | Restart application |
| `pm2 logs omnichannel-ui` | View logs |
| `pm2 monit` | Monitor resources |
| `sudo nginx -t` | Test nginx config |
| `sudo systemctl reload nginx` | Reload nginx |
| `sudo certbot --nginx -d omni-ui.kuzushilabs.xyz` | Setup SSL |
