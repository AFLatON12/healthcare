#!/bin/bash

# List of services to build and push
services=(
  "authentication-service-node"
  "appointment-service-node"
  "transaction-service-node"
  "frontend"
)

# Build and push each service
for service in "${services[@]}"
do
  echo "Building $service..."
  docker build -t ismaill370/$service:latest ./$service
  
  echo "Pushing $service..."
  docker push ismaill370/$service:latest
done

echo "All images built and pushed successfully!"
