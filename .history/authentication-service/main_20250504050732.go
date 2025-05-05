package main

import (
	"context"
	"log"
	"os"
	"time"

	"authentication-service/config"
	"authentication-service/controllers"
	"authentication-service/middleware"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func init() {
	config.LoadEnv()
}

func main() {
	// MongoDB connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI environment variable is not set")
	}

	dbName := os.Getenv("MONGODB_NAME")
	if dbName == "" {
		log.Fatal("MONGODB_NAME environment variable is not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatal("Error pinging MongoDB:", err)
	}
	log.Println("Successfully connected to MongoDB")

	db := client.Database(dbName)

	// Initialize controllers
	superAdminCtrl := controllers.NewSuperAdminController(db)
	adminCtrl := controllers.NewAdminController(db)
	doctorCtrl := controllers.NewDoctorController(db)
	patientCtrl := controllers.NewPatientController(db)

	// Initialize gin router
	router := gin.Default()

	// Public routes
	router.POST("/api/register", controllers.Register)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/google", controllers.GoogleSignIn)

	// Protected routes
	protected := router.Group("/api")
	protected.Use(middleware.JWTAuthMiddleware())
	{
		protected.GET("/me", controllers.GetCurrentUser)
	}

	router.Run()
}
