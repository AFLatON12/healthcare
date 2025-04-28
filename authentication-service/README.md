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