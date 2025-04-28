package uploader

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	_ "github.com/joho/godotenv/autoload"
)

// UploadResult contains the result of a successful file upload
type UploadResult struct {
	SecureURL string // The secure URL of the uploaded file
	PublicID  string // The public ID used to reference the file in Cloudinary
}

// Uploader handles file uploads to Cloudinary
type Uploader struct {
	cld *cloudinary.Cloudinary
}

// NewUploader creates a new Uploader instance with Cloudinary configuration
func NewUploader() (*Uploader, error) {
	// Get Cloudinary credentials from environment variables
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	// Validate credentials
	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return nil, fmt.Errorf("missing Cloudinary credentials in environment variables")
	}

	// Initialize Cloudinary client
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary client: %w", err)
	}

	return &Uploader{
		cld: cld,
	}, nil
}

// UploadPDFToCloudinary uploads a PDF file to Cloudinary and returns its secure URL and public ID
func (u *Uploader) UploadPDFToCloudinary(filePath string) (*UploadResult, error) {
	// Validate file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return nil, fmt.Errorf("file does not exist: %s", filePath)
	}

	// Validate file extension
	ext := strings.ToLower(filepath.Ext(filePath))
	if ext != ".pdf" {
		return nil, fmt.Errorf("invalid file type: %s, only PDF files are allowed", ext)
	}

	// Create upload parameters
	uploadParams := uploader.UploadParams{
		Folder:         "licenses",        // Upload to licenses folder
		ResourceType:   "auto",            // Auto-detect resource type
		UseFilename:    &[]bool{true}[0],  // Use original filename
		UniqueFilename: &[]bool{false}[0], // Allow overwriting files with same name
	}

	// Upload file
	ctx := context.Background()
	result, err := u.cld.Upload.Upload(ctx, filePath, uploadParams)
	if err != nil {
		log.Printf("Failed to upload file to Cloudinary: %v", err)
		return nil, fmt.Errorf("failed to upload file to Cloudinary: %w", err)
	}

	// Log successful upload
	log.Printf("Successfully uploaded file to Cloudinary: %s", result.SecureURL)

	return &UploadResult{
		SecureURL: result.SecureURL,
		PublicID:  result.PublicID,
	}, nil
}

// DeleteFromCloudinary deletes a file from Cloudinary using its public ID
func (u *Uploader) DeleteFromCloudinary(publicID string) error {
	ctx := context.Background()
	_, err := u.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	if err != nil {
		log.Printf("Failed to delete file from Cloudinary: %v", err)
		return fmt.Errorf("failed to delete file from Cloudinary: %w", err)
	}

	log.Printf("Successfully deleted file from Cloudinary: %s", publicID)
	return nil
}
