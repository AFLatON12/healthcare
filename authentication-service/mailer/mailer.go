package mailer

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strings"
)

// Mailer represents an email sender with SMTP configuration
type Mailer struct {
	host     string
	port     string
	email    string
	password string
}

// NewMailer creates a new Mailer instance with environment variables
func NewMailer() (*Mailer, error) {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	email := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")

	if host == "" || port == "" || email == "" || password == "" {
		return nil, fmt.Errorf("missing SMTP configuration in environment variables")
	}

	return &Mailer{
		host:     host,
		port:     port,
		email:    email,
		password: password,
	}, nil
}

// SendMail sends an HTML email to the specified recipient
func (m *Mailer) SendMail(to string, subject string, body string) error {
	// Email headers
	headers := make(map[string]string)
	headers["From"] = m.email
	headers["To"] = to
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=UTF-8"

	// Build email message
	var message strings.Builder
	for k, v := range headers {
		message.WriteString(fmt.Sprintf("%s: %s\r\n", k, v))
	}
	message.WriteString("\r\n" + body)

	// SMTP authentication
	auth := smtp.PlainAuth("", m.email, m.password, m.host)

	// TLS configuration
	tlsConfig := &tls.Config{
		InsecureSkipVerify: false,
		ServerName:         m.host,
	}

	// Connect to SMTP server
	conn, err := tls.Dial("tcp", fmt.Sprintf("%s:%s", m.host, m.port), tlsConfig)
	if err != nil {
		log.Printf("Failed to connect to SMTP server: %v", err)
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, m.host)
	if err != nil {
		log.Printf("Failed to create SMTP client: %v", err)
		return fmt.Errorf("failed to create SMTP client: %w", err)
	}
	defer client.Close()

	// Authenticate
	if err = client.Auth(auth); err != nil {
		log.Printf("Failed to authenticate with SMTP server: %v", err)
		return fmt.Errorf("failed to authenticate with SMTP server: %w", err)
	}

	// Set sender and recipient
	if err = client.Mail(m.email); err != nil {
		log.Printf("Failed to set sender: %v", err)
		return fmt.Errorf("failed to set sender: %w", err)
	}

	if err = client.Rcpt(to); err != nil {
		log.Printf("Failed to set recipient: %v", err)
		return fmt.Errorf("failed to set recipient: %w", err)
	}

	// Send email
	w, err := client.Data()
	if err != nil {
		log.Printf("Failed to prepare email data: %v", err)
		return fmt.Errorf("failed to prepare email data: %w", err)
	}

	_, err = w.Write([]byte(message.String()))
	if err != nil {
		log.Printf("Failed to write email data: %v", err)
		return fmt.Errorf("failed to write email data: %w", err)
	}

	err = w.Close()
	if err != nil {
		log.Printf("Failed to close email data: %v", err)
		return fmt.Errorf("failed to close email data: %w", err)
	}

	log.Printf("Email sent successfully to %s", to)
	return nil
}

// SendDoctorApprovalEmail sends an approval email to a doctor
func (m *Mailer) SendDoctorApprovalEmail(to string, doctorName string) error {
	subject := "Doctor Registration Approved"
	body := fmt.Sprintf(`
		<html>
			<body>
				<h2>Congratulations, Dr. %s!</h2>
				<p>Your registration has been approved. You can now log in to your account and start using our healthcare platform.</p>
				<p>Best regards,<br>The Healthcare Team</p>
			</body>
		</html>
	`, doctorName)

	return m.SendMail(to, subject, body)
}

// SendDoctorRejectionEmail sends a rejection email to a doctor
func (m *Mailer) SendDoctorRejectionEmail(to string, doctorName string, reason string) error {
	subject := "Doctor Registration Status Update"
	body := fmt.Sprintf(`
		<html>
			<body>
				<h2>Dear Dr. %s,</h2>
				<p>We regret to inform you that your registration could not be approved at this time.</p>
				<p>Reason: %s</p>
				<p>If you have any questions, please contact our support team.</p>
				<p>Best regards,<br>The Healthcare Team</p>
			</body>
		</html>
	`, doctorName, reason)

	return m.SendMail(to, subject, body)
}
