package main

import (
	"context"
	"log"
	"os"
	"time"

	"healthcare/authentication-service/config"
	"healthcare/authentication-service/controllers"
	"healthcare/authentication-service/handlers"
	"healthcare/authentication-service/routes"
	"healthcare/authentication-service/services"

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

	mongoURI := os.Getenv("MONGO_URI")

	// Construct MongoDB URI dynamically if MONGO_USER and MONGO_PASSWORD are set
	mongoUser := os.Getenv("MONGO_USER")
	mongoPassword := os.Getenv("MONGO_PASSWORD")
	if mongoUser != "" && mongoPassword != "" {
		mongoURI = "mongodb+srv://" + mongoUser + ":" + mongoPassword + "@cluster1.46bw0ws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
	}

	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable is not set")
	}

	dbName := os.Getenv("DB_name")
	if dbName == "" {
		log.Fatal("DB_name environment variable is not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatal("Error pinging MongoDB:", err)
	}
	log.Println("Successfully connected to MongoDB")

	_ = client.Database(dbName)

	// Initialize controllers
	superAdminCtrl := controllers.NewSuperAdminController(client.Database(dbName))
	adminCtrl := controllers.NewAdminController(client.Database(dbName))
	doctorCtrl := controllers.NewDoctorController(client.Database(dbName))
	patientCtrl := controllers.NewPatientController(client.Database(dbName))

	// Initialize services
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set")
	}
	authService := services.NewAuthService(
		superAdminCtrl,
		adminCtrl,
		doctorCtrl,
		patientCtrl,
		jwtSecret,
	)
	socialAuthService := services.NewSocialAuthService(patientCtrl)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	socialAuthHandler := handlers.NewSocialAuthHandler(socialAuthService, authService)
	healthHandler := handlers.NewHealthHandler() // Ensure this is implemented in the handlers package

	// Initialize gin router
	router := gin.Default()

	// Register all routes using the RegisterRoutes function
	routes.RegisterRoutes(router, authHandler, healthHandler, socialAuthHandler, authService)

	router.Run()
}
