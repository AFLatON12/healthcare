# 🏥 Distributed Healthcare Management System

This is a microservices-based healthcare system developed for the **CSE474 - Distributed Information Systems** course at Alalamein University. The project emphasizes scalability, security, and modular design using **Docker**, **Kubernetes**, and **Node.js** microservices.

---

## 🧩 Microservices Overview

### 1. 🔐 Auth Service
Handles all authentication and authorization logic.

- **JWT-based** login & session management
- **OAuth** login support (Google, Facebook)
- **Multi-Factor Authentication (MFA)** for added security
- **Role-Based Access Control (RBAC)**: Admin, Doctor, Patient

### 2. 🩺 Management Service
Responsible for core healthcare logic and data management.

- CRUD for **Patients**, **Doctors**, and **Medical Staff**
- Doctor availability and **Appointment Scheduling**
- **Digital Prescription** generation
- Real-time **medical record synchronization**

### 3. 💳 Billing Service
Manages hospital billing, insurance, and financial reports.

- Secure payment gateway integration (Stripe/PayPal)
- Blockchain-based **insurance claim validation**
- **Invoice generation** and billing reports

---

## 🚀 Technologies Used

| Category        | Tools/Technologies                        |
|-----------------|-------------------------------------------|
| Frontend        | React.js / Vue.js / Angular               |
| Backend         | Node.js + Express.js                      |
| Database        | MongoDB Atlas, Google Cloud Spanner       |
| Authentication  | JWT, OAuth, MFA                           |
| DevOps          | Docker, Docker Compose, Kubernetes        |
| Serverless      | AWS Lambda, Google Cloud Functions        |
| Caching         | Redis (planned/optional)                  |
| Blockchain      | For insurance claim verification          |

---

## 🧱 System Architecture

Each service runs in its own Docker container. Communication is handled via **REST APIs**, secured through JWT and role validation.

