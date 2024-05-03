#!/bin/bash

docker rmi iwa-api:latest
rm -rf dist
npm run build
docker build --tag iwa-api:latest .
