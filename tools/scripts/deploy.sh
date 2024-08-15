#!/bin/bash

set -e
set -o pipefail

if [ "$(basename "$(pwd)")" != "nifty" ]; then
  echo "Please run this script in the root directory of the project"
  exit 1
fi

rsync -avz --exclude='.git' \
  --exclude='node_modules' \
  --exclude='**/node_modules' \
  --exclude="**/dist" \
  --exclude='**/build' \
  --exclude='**/.next' \
  --exclude='data' \
  --exclude='.env' \
  --exclude='**/.env' \
  --exclude='*.log' \
  --exclude='*.tmp' \
  --exclude='*.swp' \
  --exclude='.DS_Store' \
  ./ nifty:/home/ec2-user/nifty
