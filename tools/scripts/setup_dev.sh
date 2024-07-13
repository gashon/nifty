#!/bin/bash

set -e
set -o pipefail

# run in root directory
if [ "$(basename "$(pwd)")" != "nifty" ]; then
  echo "Please run this script in the root directory of the project"
  exit 1
fi

# run migrations
pnpm run dev --filter @nifty/db &
db_pid=$!

# check nc is installed
if command -v nc &>/dev/null; then
  echo "nc is installed"
else
  echo "nc is not installed. Please install netcat"
  exit 1
fi

# wait with nc
while ! nc -z localhost 5431; do
  sleep 1
done

(cd packages/db && pnpm run migrate)

docker container rm nifty-db -f
