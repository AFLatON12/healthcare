# Healthcare Transaction Service Postman Collection

This directory contains a Postman collection for testing and interacting with the Healthcare Transaction Service API.

## Collection Overview

The Postman collection includes endpoints for:

- Health checks
- Payment management
- Insurance claim processing
- Invoice handling

## How to Import the Collection

1. Open Postman
2. Click on "Import" in the top left corner
3. Select the `Transaction_Service.postman_collection.json` file from this directory
4. Click "Import" to add the collection to your Postman workspace

## Collection Structure

The collection is organized into the following folders:

### Health Check
- `GET /health` - Check if the service is running properly

### Payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/:id` - Get a payment by ID
- `PUT /api/payments/:id` - Update a payment
- `GET /api/payments` - List all payments (with optional filtering)

### Insurance Claims
- `POST /api/claims` - Create a new insurance claim
- `GET /api/claims/:id` - Get a claim by ID
- `PUT /api/claims/:id` - Update a claim
- `GET /api/claims` - List all claims (with optional filtering)

### Invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/:id` - Get an invoice by ID
- `PUT /api/invoices/:id` - Update an invoice
- `GET /api/invoices` - List all invoices (with optional filtering)

## Environment Setup

The collection uses a variable for the base URL:

- `baseUrl`: The base URL of the API (default: http://localhost:8080)

To set up an environment:

1. In Postman, click on "Environments" in the sidebar
2. Click "Create Environment"
3. Add a variable named `baseUrl` with the value of your API server (e.g., http://localhost:8080)
4. Save the environment and select it from the environment dropdown in the top right corner

## Example Usage

### Creating a Payment

1. Select the "Create Payment" request from the Payments folder
2. The request body is pre-filled with example data
3. Modify the request body as needed
4. Click "Send" to create a new payment
5. The response will include the created payment with an ID

### Retrieving a Payment

1. Select the "Get Payment by ID" request
2. Replace the ID in the URL with an actual payment ID
3. Click "Send" to retrieve the payment details

### Listing Payments for a Patient

1. Select the "List Payments" request
2. The request includes a query parameter for filtering by patient_id
3. Modify the patient_id parameter as needed
4. Click "Send" to retrieve all payments for the specified patient

## Response Examples

Each request in the collection includes example responses to help you understand the expected data format:

- Success responses (200 OK, 201 Created)
- Error responses (400 Bad Request, 404 Not Found)

## Testing the API

You can use this collection to:

1. Verify that your API is working correctly
2. Test different scenarios and edge cases
3. Document the API behavior for other developers
4. Automate testing using Postman's test scripts

## Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)
- [Healthcare Transaction Service README](../README.md) 