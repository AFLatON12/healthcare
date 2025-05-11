# Instructions for Building, Tagging, and Pushing Docker Images

## Prerequisites
- Docker installed and running on your machine.
- Docker Hub account (https://hub.docker.com/).
- Logged in to Docker Hub via CLI:  
  ```bash
  docker login
  ```

## Build Docker Images Locally

From the root of your project directory, run the following commands for each service:

```bash
# Build api-gateway image
docker build -t ismaill370/api-gateway:latest ./api-gateway

# Build authentication-service image
docker build -t ismaill370/authentication-service:latest ./authentication-service-node

# Build appointment-service image
docker build -t ismaill370/appointment-service:latest ./appointment-service-node

# Build transaction-service image
docker build -t ismaill370/transaction-service:latest ./transaction-service-node

# Build frontend image
docker build -t ismaill370/frontend:latest ./frontend
```

## Push Images to Docker Hub

After building, push each image to Docker Hub:

```bash
docker push ismaill370/api-gateway:latest
docker push ismaill370/authentication-service:latest
docker push ismaill370/appointment-service:latest
docker push ismaill370/transaction-service:latest
docker push ismaill370/frontend:latest
```

## Running the Project Using Pre-built Images

Use the provided `docker-compose.prod.yml` file to run the project:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This will pull the images from Docker Hub and start all services.

## Notes

- Ensure your `.env` file contains the required environment variables such as `MONGO_URI`, `MONGO_USER`, `MONGO_PASSWORD`, and `JWT_SECRET`.
- To stop the services, run:

```bash
docker-compose -f docker-compose.prod.yml down
```

- To view logs for a specific service, use:

```bash
docker-compose -f docker-compose.prod.yml logs -f <service-name>
```

Replace `<service-name>` with the container name, e.g., `frontend`, `appointment-service`.

---

If you need help with any of these steps or want me to assist with testing, please let me know.
