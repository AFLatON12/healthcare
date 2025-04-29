# Build stage
FROM golang:1.24-alpine AS builder

# Install build dependencies
RUN apk add --no-cache gcc musl-dev git

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o appointmentservice .

# Final stage
FROM alpine:3.19

# Install CA certificates for MongoDB Atlas connection
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN adduser -D -g '' appuser

# Set working directory
WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/appointmentservice .

# Copy any required configurations
COPY --from=builder /app/config ./config

# Set ownership
RUN chown -R appuser:appuser /app

# Use non-root user
USER appuser

# Environment variables
ENV PORT=8080
ENV GIN_MODE=release
ENV MONGODB_URI="mongodb+srv://ismailyasser:Z1x2c312@cluster1.46bw0ws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
ENV DB_NAME="appointment_management_db"

# Expose port
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/health || exit 1

# Run the application
CMD ["./appointmentservice"]
