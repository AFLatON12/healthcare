# Authentication Service API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
All endpoints except `/auth/login`, `/auth/initialize-super-admin`, `/auth/google`, `/auth/facebook`, and their callbacks require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Health Check
- **Endpoint**: `/health`
- **Method**: GET
- **Description**: Check if the service is running
- **Response**:
  ```json
  "OK"
  ```

### 2. Authentication

#### Login
- **Endpoint**: `/auth/login`
- **Method**: POST
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "admin" // One of: super_admin, admin, doctor, patient
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "role": "admin",
      "permissions": ["admin:create", "admin:list"]
    }
  }
  ```

#### Social Login - Google
- **Endpoint**: `/auth/google`
- **Method**: GET
- **Description**: Redirect to Google OAuth login page
- **Response**: Redirects to Google login page

#### Social Login - Google Callback
- **Endpoint**: `/auth/google/callback`
- **Method**: GET
- **Description**: Handle Google OAuth callback
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "user@gmail.com",
      "name": "John Doe",
      "role": "patient",
      "provider": "google",
      "avatar_url": "https://..."
    }
  }
  ```

#### Social Login - Facebook
- **Endpoint**: `/auth/facebook`
- **Method**: GET
- **Description**: Redirect to Facebook OAuth login page
- **Response**: Redirects to Facebook login page

#### Social Login - Facebook Callback
- **Endpoint**: `/auth/facebook/callback`
- **Method**: GET
- **Description**: Handle Facebook OAuth callback
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "email": "user@facebook.com",
      "name": "John Doe",
      "role": "patient",
      "provider": "facebook",
      "avatar_url": "https://..."
    }
  }
  ```

#### Initialize Super Admin
- **Endpoint**: `/auth/initialize-super-admin`
- **Method**: POST
- **Description**: Create the first super admin user
- **Request Body**:
  ```json
  {
    "email": "superadmin@example.com",
    "password": "strongpassword123",
    "name": "Super Admin"
  }
  ```
- **Response**:
  ```json
  {
    "id": "123",
    "email": "superadmin@example.com",
    "name": "Super Admin",
    "role": "super_admin",
    "created_at": "2024-03-20T10:00:00Z"
  }
  ```

### 3. Admin Management

#### Create Admin
- **Endpoint**: `/admins`
- **Method**: POST
- **Required Permission**: `admin:create`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "permissions": ["admin:list", "admin:view"]
  }
  ```
- **Response**:
  ```json
  {
    "id": "456",
    "email": "admin@example.com",
    "name": "Admin User",
    "permissions": ["admin:list", "admin:view"],
    "created_at": "2024-03-20T10:00:00Z"
  }
  ```

#### List Admins
- **Endpoint**: `/admins`
- **Method**: GET
- **Required Permission**: `admin:list`
- **Response**:
  ```json
  {
    "admins": [
      {
        "id": "456",
        "email": "admin@example.com",
        "name": "Admin User",
        "permissions": ["admin:list", "admin:view"],
        "created_at": "2024-03-20T10:00:00Z"
      }
    ]
  }
  ```

#### Get Admin
- **Endpoint**: `/admins/{id}`
- **Method**: GET
- **Required Permission**: `admin:view`
- **Response**:
  ```json
  {
    "id": "456",
    "email": "admin@example.com",
    "name": "Admin User",
    "permissions": ["admin:list", "admin:view"],
    "created_at": "2024-03-20T10:00:00Z"
  }
  ```

#### Update Admin
- **Endpoint**: `/admins/{id}`
- **Method**: PUT
- **Required Permission**: `admin:update`
- **Request Body**:
  ```json
  {
    "name": "Updated Admin Name",
    "permissions": ["admin:list", "admin:view", "admin:update"]
  }
  ```
- **Response**:
  ```json
  {
    "id": "456",
    "email": "admin@example.com",
    "name": "Updated Admin Name",
    "permissions": ["admin:list", "admin:view", "admin:update"],
    "updated_at": "2024-03-20T11:00:00Z"
  }
  ```

#### Delete Admin
- **Endpoint**: `/admins/{id}`
- **Method**: DELETE
- **Required Permission**: `admin:delete`
- **Response**:
  ```json
  {
    "message": "Admin deleted successfully"
  }
  ```

### 4. Doctor Management

#### Register Doctor
- **Endpoint**: `/doctors/register`
- **Method**: POST
- **Description**: Register a new doctor (pending approval)
- **Request Body**:
  ```json
  {
    "email": "doctor@example.com",
    "password": "password123",
    "name": "Dr. John Doe",
    "specialization": "Cardiology",
    "license_number": "DOC123456",
    "qualifications": ["MD", "PhD"],
    "experience_years": 10
  }
  ```
- **Response**:
  ```json
  {
    "id": "789",
    "email": "doctor@example.com",
    "name": "Dr. John Doe",
    "status": "pending",
    "created_at": "2024-03-20T10:00:00Z"
  }
  ```

#### List Doctors
- **Endpoint**: `/doctors`
- **Method**: GET
- **Required Permission**: `doctor:list`
- **Response**:
  ```json
  {
    "doctors": [
      {
        "id": "789",
        "email": "doctor@example.com",
        "name": "Dr. John Doe",
        "specialization": "Cardiology",
        "status": "approved",
        "created_at": "2024-03-20T10:00:00Z"
      }
    ]
  }
  ```

#### List Pending Doctors
- **Endpoint**: `/doctors/pending`
- **Method**: GET
- **Required Permission**: `doctor:list`
- **Response**:
  ```json
  {
    "doctors": [
      {
        "id": "789",
        "email": "doctor@example.com",
        "name": "Dr. John Doe",
        "specialization": "Cardiology",
        "status": "pending",
        "created_at": "2024-03-20T10:00:00Z"
      }
    ]
  }
  ```

#### Approve Doctor
- **Endpoint**: `/doctors/{id}/approve`
- **Method**: POST
- **Required Permission**: `doctor:approve`
- **Response**:
  ```json
  {
    "message": "Doctor approved successfully",
    "doctor": {
      "id": "789",
      "email": "doctor@example.com",
      "name": "Dr. John Doe",
      "status": "approved",
      "approved_at": "2024-03-20T11:00:00Z"
    }
  }
  ```

#### Reject Doctor
- **Endpoint**: `/doctors/{id}/reject`
- **Method**: POST
- **Required Permission**: `doctor:reject`
- **Response**:
  ```json
  {
    "message": "Doctor rejected successfully",
    "doctor": {
      "id": "789",
      "email": "doctor@example.com",
      "name": "Dr. John Doe",
      "status": "rejected",
      "rejected_at": "2024-03-20T11:00:00Z"
    }
  }
  ```

### 5. Patient Management

#### Register Patient
- **Endpoint**: `/patients/register`
- **Method**: POST
- **Description**: Register a new patient
- **Request Body**:
  ```json
  {
    "email": "patient@example.com",
    "password": "password123",
    "name": "John Smith",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country"
  }
  ```
- **Response**:
  ```json
  {
    "id": "101",
    "email": "patient@example.com",
    "name": "John Smith",
    "created_at": "2024-03-20T10:00:00Z"
  }
  ```

#### List Patients
- **Endpoint**: `/patients`
- **Method**: GET
- **Required Permission**: `patient:list`
- **Response**:
  ```json
  {
    "patients": [
      {
        "id": "101",
        "email": "patient@example.com",
        "name": "John Smith",
        "date_of_birth": "1990-01-01",
        "gender": "male",
        "created_at": "2024-03-20T10:00:00Z"
      }
    ]
  }
  ```

#### Get Patient History
- **Endpoint**: `/patients/{id}/history`
- **Method**: GET
- **Required Permission**: `patient:history`
- **Response**:
  ```json
  {
    "history": [
      {
        "id": "1",
        "patient_id": "101",
        "doctor_id": "789",
        "diagnosis": "Common cold",
        "prescription": "Rest and fluids",
        "created_at": "2024-03-20T10:00:00Z"
      }
    ]
  }
  ```

#### Add Patient History
- **Endpoint**: `/patients/{id}/history`
- **Method**: POST
- **Required Permission**: `patient:history`
- **Request Body**:
  ```json
  {
    "doctor_id": "789",
    "diagnosis": "Common cold",
    "prescription": "Rest and fluids",
    "notes": "Patient should rest for 2-3 days"
  }
  ```
- **Response**:
  ```json
  {
    "id": "1",
    "patient_id": "101",
    "doctor_id": "789",
    "diagnosis": "Common cold",
    "prescription": "Rest and fluids",
    "created_at": "2024-03-20T10:00:00Z"
  }
  ```

### 6. System Management

#### Get System Config
- **Endpoint**: `/system/config`
- **Method**: GET
- **Required Permission**: `system:config`
- **Response**:
  ```json
  {
    "config": {
      "max_login_attempts": 5,
      "session_timeout": 3600,
      "password_policy": {
        "min_length": 8,
        "require_numbers": true,
        "require_special_chars": true
      }
    }
  }
  ```

#### Update System Config
- **Endpoint**: `/system/config`
- **Method**: PUT
- **Required Permission**: `system:config`
- **Request Body**:
  ```json
  {
    "max_login_attempts": 3,
    "session_timeout": 7200,
    "password_policy": {
      "min_length": 10,
      "require_numbers": true,
      "require_special_chars": true
    }
  }
  ```
- **Response**:
  ```json
  {
    "message": "System configuration updated successfully",
    "config": {
      "max_login_attempts": 3,
      "session_timeout": 7200,
      "password_policy": {
        "min_length": 10,
        "require_numbers": true,
        "require_special_chars": true
      }
    }
  }
  ```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Passwords must meet the system's password policy requirements
3. JWT tokens expire after the configured session timeout
4. Rate limiting may be applied to prevent abuse
5. All sensitive data is encrypted in transit and at rest 