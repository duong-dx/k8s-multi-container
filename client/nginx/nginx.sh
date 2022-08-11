#!/bin/bash

echo $CLIENT_PORT;

####/bin/bash -c "envsubst '$CLIENT_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
