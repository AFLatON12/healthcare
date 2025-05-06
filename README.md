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
