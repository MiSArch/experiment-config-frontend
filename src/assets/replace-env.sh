#!/bin/sh
# replace-env.sh
# Use this script to replace environment placeholders with actual environment variable values

set -e

# Check if the CONFIG_SERVICE_ENDPOINT variable is set
if [ -z "$CONFIG_SERVICE_ENDPOINT" ]; then
  echo "CONFIG_SERVICE_ENDPOINT is not set. Using default."
else
  # Replace the placeholder in the environment.prod.ts file
  sed -i "s|WILL_BE_REPLACED_BY_BUILD|$CONFIG_SERVICE_ENDPOINT|g" /app/src/environments/environment.ts
fi
