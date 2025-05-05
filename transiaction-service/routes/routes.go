package routes

import (
	"transiaction-service/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

// SetupRouter configures all the routes for the application
func SetupRouter(db *mongo.Database) *gin.Engine {
	// Initialize Gin router
	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Initialize controllers
	paymentController := controllers.NewPaymentController(db)
	claimController := controllers.NewClaimController(db)
	invoiceController := controllers.NewInvoiceController(db)

	// API routes
	api := r.Group("/api")
	{
		// Payment routes
		payments := api.Group("/payments")
		{
			payments.POST("/", paymentController.CreatePayment)
			payments.GET("/:id", paymentController.GetPayment)
			payments.PUT("/:id", paymentController.UpdatePayment)
			payments.GET("/", paymentController.ListPayments)
		}

		// Insurance claim routes
		claims := api.Group("/claims")
		{
			claims.POST("/", claimController.CreateClaim)
			claims.GET("/:id", claimController.GetClaim)
			claims.PUT("/:id", claimController.UpdateClaim)
			claims.GET("/", claimController.ListClaims)
			claims.POST("/:id/reject", claimController.RejectClaim)
		}

		// Invoice routes
		invoices := api.Group("/invoices")
		{
			invoices.POST("/", invoiceController.CreateInvoice)
			invoices.GET("/:id", invoiceController.GetInvoice)
			invoices.PUT("/:id", invoiceController.UpdateInvoice)
			invoices.GET("/", invoiceController.ListInvoices)
			invoices.POST("/:id/partial-payment", invoiceController.ProcessPartialPayment)
		}
	}

	return r
}
