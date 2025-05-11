#!/bin/bash

# Build and push Docker images to Docker Hub

# Set your Docker Hub username
DOCKER_USERNAME=ismaill370

# List of services and their directories
services=(
  "api-gateway"
  "authentication-service-node"
  "appointment-service-node"
  "transaction-service-node"
  "frontend"
)

for service in "${services[@]}"
do
  echo "Building image for $service..."
  docker build -t $DOCKER_USERNAME/$service:latest ./$service

  echo "Pushing image for $service..."
  docker push $DOCKER_USERNAME/$service:latest
done

echo "All images built and pushed successfully."
