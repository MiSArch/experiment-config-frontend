#!/usr/bin/env sh
set -eu

envsubst '${EXPERIMENT_CONFIG_ENDPOINT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"