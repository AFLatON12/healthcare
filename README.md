# 🏥 Healthcare Microservices System

A distributed healthcare management platform built with microservices architecture, aiming to provide reliable and scalable management for appointments, authentication, and transactions between doctors and patients.

---

## 📌 Features

- Role-based authentication (Patients, Doctors, Admins)
- Appointment booking and management
- Secure login and user registration
- Transaction management (payments, invoices)
- Scalable microservices using Docker and Kubernetes
- RESTful APIs and modern frontend using React

---

## 🧱 Project Structure

```
healthcare/
├── appointment-service-node     # Handles appointment CRUD operations
├── authentication-service-node  # Manages user login/signup
├── transaction-service-node     # Manages payment and billing
├── frontend                     # React-based UI
├── k8s                          # Kubernetes deployment files
└── docker-compose.yml           # Docker Compose for local orchestration
```

---

## 🧰 Technologies Used

### Backend
- **Node.js** (Express)
- **Go** (optional depending on implementation)
- **MongoDB** / **PostgreSQL**

### Frontend
- **React.js** (with Axios)

### DevOps & Deployment
- **Docker** & **Docker Compose**
- **Kubernetes (k8s)**
- **JWT** for authentication

---

## 🚀 Getting Started

### Prerequisites
- Docker
- Docker Compose
- Node.js
- (Optional) Kubernetes and kubectl if deploying on cluster

### Local Development (Using Docker Compose)
```bash
# Clone the repository
git clone https://github.com/ismail-yasser/healthcare.git
cd healthcare

# Build and run all services
docker-compose up --build
```

Frontend will be available at: [http://localhost:3000](http://localhost:3000)

---

## 📡 API Overview

### Auth Service (`/authentication`)
- `POST /signup` – Register a new user
- `POST /login` – Authenticate user and return JWT
- `GET /profile` – Retrieve current user's data

### Appointment Service (`/appointments`)
- `GET /` – Get all appointments
- `POST /` – Create new appointment
- `PUT /:id` – Update appointment
- `DELETE /:id` – Cancel appointment

### Transaction Service (`/transactions`)
- `GET /` – Get all transactions
- `POST /` – Create a transaction

---

## 💻 Frontend

The frontend is built in React and connects to the backend services using Axios. It provides:

- User login/registration pages
- Dashboard for Patients/Doctors
- Appointment scheduler
- Payment UI

---

## 📦 Kubernetes Deployment (Optional)

All services are containerized and include deployment files under the `k8s/` directory. To deploy on a k8s cluster:

```bash
kubectl apply -f k8s/
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ismail Yasser**
**Khaled elgreitly**


---

## 🙌 Contributions

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# Healthcare Microservices Project

This is a microservices-based healthcare application with the following components:
- Frontend (React)
- Authentication Service (Node.js)
- Appointment Service (Node.js)
- Transaction Service (Node.js)
- API Gateway
- MongoDB Database

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=mongodb://mongo:27017/healthcare
MONGO_USER=your_mongo_user
MONGO_PASSWORD=your_mongo_password
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd healthcare
```

2. Start all services using Docker Compose:
```bash
docker-compose up --build
```

This will start all services:
- Frontend: http://localhost:3000
- Authentication Service: http://localhost:8000
- Appointment Service: http://localhost:8081
- Transaction Service: http://localhost:8082
- API Gateway: http://localhost:8080
- MongoDB: localhost:27017

## Development

### Individual Service Development

Each service can be run independently for development:

1. Frontend:
```bash
cd frontend
npm install
npm start
```

2. Authentication Service:
```bash
cd authentication-service-node
npm install
npm start
```

3. Appointment Service:
```bash
cd appointment-service-node
npm install
npm start
```

4. Transaction Service:
```bash
cd transaction-service-node
npm install
npm start
```

### Stopping the Application

To stop all services:
```bash
docker-compose down
```

To stop and remove all containers, networks, and volumes:
```bash
docker-compose down -v
```

## Project Structure

```
healthcare/
├── frontend/                 # React frontend application
├── authentication-service-node/  # Authentication microservice
├── appointment-service-node/     # Appointment management microservice
├── transaction-service-node/     # Transaction handling microservice
├── docker-compose.yml        # Docker Compose configuration
└── .env                      # Environment variables (create this file)
```

## Troubleshooting

1. If services fail to start, check the logs:
```bash
docker-compose logs [service-name]
```

2. If MongoDB connection fails:
- Ensure MongoDB container is running: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongo`
- Verify environment variables in `.env` file

3. If services can't communicate:
- Ensure all services are running: `docker-compose ps`
- Check network connectivity: `docker network ls`
- Verify service URLs in environment variables

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
