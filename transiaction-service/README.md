# Transaction Service

This service handles all transaction-related operations in the healthcare system, including payments, insurance claims, and invoices.

## Features

- Payment processing and management
- Insurance claim handling
- Invoice generation and management
- MongoDB integration for data persistence
- RESTful API endpoints

## Prerequisites

- Go 1.21 or higher
- MongoDB 4.4 or higher
- Docker (optional)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   go mod download
   ```

3. Set up MongoDB:
   - Make sure MongoDB is running on localhost:27017
   - The service will automatically create the required database and collections

4. Run the service:
   ```bash
   go run main.go
   ```

## Docker Setup

1. Build the Docker image:
   ```bash
   docker build -t transaction-service .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 transaction-service
   ```

## API Routes

### Health Check
- `GET /health` - Check if the service is running

### Payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/:id` - Get a payment by ID
- `PUT /api/payments/:id` - Update a payment
- `GET /api/payments` - List all payments (with optional filtering by patient_id)

### Insurance Claims
- `POST /api/claims` - Create a new insurance claim
- `GET /api/claims/:id` - Get a claim by ID
- `PUT /api/claims/:id` - Update a claim
- `GET /api/claims` - List all claims (with optional filtering by patient_id)

### Invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/:id` - Get an invoice by ID
- `PUT /api/invoices/:id` - Update an invoice
- `GET /api/invoices` - List all invoices (with optional filtering by patient_id)

## Request/Response Examples

### Create Payment
```json
// POST /api/payments
{
  "amount": 150.00,
  "currency": "USD",
  "status": "pending",
  "method": "credit_card",
  "patient_id": "12345",
  "description": "Payment for consultation"
}
```

### Create Insurance Claim
```json
// POST /api/claims
{
  "patient_id": "12345",
  "insurance_id": "INS789",
  "amount": 500.00,
  "status": "submitted",
  "service_date": "2023-04-29T10:00:00Z",
  "description": "Claim for emergency room visit",
  "documentation_url": "https://example.com/docs/claim123.pdf"
}
```

### Create Invoice
```json
// POST /api/invoices
{
  "patient_id": "12345",
  "amount": 200.00,
  "status": "unpaid",
  "due_date": "2023-05-15T00:00:00Z",
  "items": [
    {
      "description": "Consultation",
      "amount": 150.00,
      "quantity": 1
    },
    {
      "description": "Lab test",
      "amount": 50.00,
      "quantity": 1
    }
  ],
  "description": "Invoice for medical services"
}
```

## Running the Service

1. Make sure MongoDB is running
2. Run the service:
   ```
   go run main.go
   ```
3. The service will start on port 8080

## Environment Variables

- `MONGODB_URI` - MongoDB connection string (default: "mongodb://localhost:27017")
- `PORT` - Port to run the service on (default: 8080)

## Data Models

### Payment
```json
{
  "_id": ObjectId,
  "patient_id": ObjectId,
  "appointment_id": ObjectId,
  "amount": Number,
  "status": String,
  "payment_method": String,
  "transaction_date": Date,
  "insurance_claim_id": ObjectId,
  "invoice_url": String
}
```

### Insurance Claim
```json
{
  "_id": ObjectId,
  "patient_id": ObjectId,
  "insurance_provider": String,
  "policy_number": String,
  "claim_amount": Number,
  "status": String,
  "submitted_date": Date,
  "approved_date": Date
}
```

### Invoice
```json
{
  "_id": ObjectId,
  "patient_id": ObjectId,
  "appointment_id": ObjectId,
  "amount_due": Number,
  "due_date": Date,
  "payment_status": String,
  "issued_date": Date,
  "services": [String],
  "pdf_url": String
}
```

## Error Handling

The service returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 