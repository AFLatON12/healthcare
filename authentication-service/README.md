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