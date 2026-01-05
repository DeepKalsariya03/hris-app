#!/bin/sh
set -e

# Create nginx runtime directories with proper permissions
mkdir -p /var/cache/nginx/client_temp \
         /var/cache/nginx/proxy_temp \
         /var/cache/nginx/fastcgi_temp \
         /var/cache/nginx/uwsgi_temp \
         /var/cache/nginx/scgi_temp \
         /var/log/nginx \
         /run

# Set ownership to nodejs user (nginx workers run as nodejs)
chown -R nodejs:nodejs /var/cache/nginx /var/log/nginx /run

# Start nginx (master runs as root, workers as nodejs per config)
exec nginx -g "daemon off;"
