<<<<<<< HEAD
# Healthcare Authentication Service

## Overview
The Authentication Service is a microservice responsible for managing user authentication and authorization in the healthcare system. It provides secure user registration, login, and role-based access control (RBAC) for different user types (admin, doctor, patient).

## Features

### 1. User Management
- User registration with role assignment
- Secure login with JWT authentication
- Password hashing using bcrypt
- User profile management
- Password change functionality

### 2. Role-Based Access Control (RBAC)
- Three distinct roles:
  - Admin: Full system access
  - Doctor: Access to doctor-specific features
  - Patient: Access to patient-specific features
- Role-specific endpoints and middleware protection

### 3. Security Features
- JWT (JSON Web Tokens) for stateless authentication
- Secure password hashing with bcrypt
- HTTP-only cookies for token storage
- CORS protection
- Input validation and sanitization
- MongoDB injection protection

## Technical Stack

### Backend
- **Language**: Go (Golang)
- **Framework**: Standard `net/http` package
- **Router**: Gorilla Mux
- **Database**: MongoDB
- **Authentication**: JWT (github.com/golang-jwt/jwt/v4)
- **Password Hashing**: bcrypt (golang.org/x/crypto/bcrypt)

### Development Tools
- **API Testing**: Postman
- **Containerization**: Docker
- **Version Control**: Git
- **Environment Management**: godotenv

## API Endpoints

### Authentication
1. **Register User**
   ```
   POST /api/register
   Content-Type: application/json
   
   {
       "name": "User Name",
       "email": "user@example.com",
       "password": "secure-password",
       "role": "admin|doctor|patient"
   }
   ```

2. **Login**
   ```
   POST /api/login
   Content-Type: application/json
   
   {
       "email": "user@example.com",
       "password": "secure-password"
   }
   ```

3. **Logout**
   ```
   POST /api/logout
   ```

### User Profile
1. **Get Profile**
   ```
   GET /api/profile
   ```

2. **Change Password**
   ```
   POST /api/change-password
   Content-Type: application/json
   
   {
       "current_password": "old-password",
       "new_password": "new-password"
   }
   ```

### Role-Specific Zones
1. **Admin Zone**
   ```
   GET /api/admin-zone
   ```

2. **Doctor Zone**
   ```
   GET /api/doctor-zone
   ```

3. **Patient Zone**
   ```
   GET /api/patient-zone
   ```

## Security Implementation

### 1. JWT Authentication
- Token-based authentication using JWT
- Tokens contain:
  - User ID
  - Email
  - Role
  - Expiration time
- Tokens are signed with a secret key
- 24-hour token expiration

### 2. Password Security
- Passwords are hashed using bcrypt
- Salt is automatically generated
- Minimum password requirements enforced
- Secure password change mechanism

### 3. CORS Protection
- Configurable CORS headers
- Origin validation
- Credentials support
- Preflight request handling

### 4. Middleware Security
- Authentication middleware
- Role-based access middleware
- Request validation
- Error handling

## Database Schema

### User Collection
```json
{
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "password": "string (hashed)",
    "role": "string (admin|doctor|patient)"
}
```

## Environment Variables
```
PORT=8000
MONGODB_URI=mongodb+srv://...
DB_NAME=authdb
JWT_SECRET=your-secret-key
```

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ismail-yasser/healthcare.git
   cd healthcare/authentication-service
   ```

2. **Install Dependencies**
   ```bash
   go mod download
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update environment variables

4. **Run the Service**
   ```bash
   go run main.go
   ```

## Docker Deployment
```bash
docker build -t auth-service .
docker run -p 8000:8000 auth-service
```

## Best Practices Implemented

1. **Code Organization**
   - Clean architecture
   - Separation of concerns
   - Modular design

2. **Error Handling**
   - Consistent error responses
   - Detailed error messages
   - Proper HTTP status codes

3. **Security**
   - Input validation
   - SQL injection prevention
   - XSS protection
   - CSRF protection

4. **Performance**
   - Connection pooling
   - Request timeout handling
   - Efficient database queries

## Testing
- Postman collection included
- API endpoint testing
- Authentication flow testing
- Role-based access testing

## Future Improvements
1. Implement refresh tokens
2. Add rate limiting
3. Implement 2FA
4. Add audit logging
5. Implement session management
6. Add API documentation (Swagger)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License. 
=======
# Healthcare Authentication Service

A secure and scalable authentication service for healthcare applications, built with Go and MongoDB.

## Features

- User registration and authentication
- Role-based access control (Admin, Doctor, Patient)
- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- MongoDB integration
- Docker support
- Live reload for development

## Prerequisites

- Go 1.21 or higher
- MongoDB 6.0 or higher
- Docker and Docker Compose (optional)

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/healthcare-auth-service.git
   cd healthcare-auth-service
   ```

2. Install dependencies:
   ```bash
   go mod download
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start MongoDB:
   ```bash
   # Using Docker
   docker-compose up -d mongodb
   
   # Or using local MongoDB instance
   mongod --dbpath ./data
   ```

5. Run the service:
   ```bash
   # Development mode with live reload
   air
   
   # Or production mode
   go run cmd/server/main.go
   ```

### Using Docker

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User Management

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `DELETE /api/users/me` - Delete current user account

### Admin Endpoints

- `GET /api/admin/users` - List all users (Admin only)
- `GET /api/admin/users/:id` - Get user by ID (Admin only)
- `PUT /api/admin/users/:id` - Update user (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

## Project Structure

```
.
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── api/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── config/
│   ├── models/
│   └── services/
├── pkg/
│   ├── database/
│   └── utils/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── go.mod
└── README.md
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS protection
- Environment variable configuration
- Secure headers
- Rate limiting (TODO)
- Input validation
- Error handling

## Development

### Running Tests

```bash
go test ./... -v
```

### Code Coverage

```bash
go test ./... -coverprofile=coverage.txt
go tool cover -html=coverage.txt
```

### Linting

```bash
golangci-lint run
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Gin Web Framework](https://github.com/gin-gonic/gin)
- [MongoDB Go Driver](https://github.com/mongodb/mongo-go-driver)
- [JWT-Go](https://github.com/golang-jwt/jwt)
- [Bcrypt](https://github.com/cespare/bcrypt) 
>>>>>>> 127ec709e9f781bfc8a75e9ff42e909cebd31eb1
