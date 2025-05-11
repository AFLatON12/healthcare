# Docker Image Building and Pushing Instructions

## Building Images

### Build authentication-service image
```bash
docker build -t ismaill370/authentication-service-node:latest ./authentication-service-node
```

### Build appointment-service image
```bash
docker build -t ismaill370/appointment-service-node:latest ./appointment-service-node
```

### Build transaction-service image
```bash
docker build -t ismaill370/transaction-service-node:latest ./transaction-service-node
```

### Build frontend image
```bash
docker build -t ismaill370/frontend:latest ./frontend
```

## Pushing Images to Docker Hub

### Push authentication-service image
```bash
docker push ismaill370/authentication-service-node:latest
```

### Push appointment-service image
```bash
docker push ismaill370/appointment-service-node:latest
```

### Push transaction-service image
```bash
docker push ismaill370/transaction-service-node:latest
```

### Push frontend image
```bash
docker push ismaill370/frontend:latest
```

## Running the Application

To run the application using the pre-built images:

```bash
docker-compose -f docker-compose.prod.yml up
```

This will pull and run all the services using the images from Docker Hub.

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
