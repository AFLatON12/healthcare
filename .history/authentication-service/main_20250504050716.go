package main

import (
	"authentication-service/controllers"
	"authentication-service/initializers"
	"authentication-service/middlewares"

	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
}

func main() {
	router := gin.Default()

	// Public routes
	router.POST("/api/register", controllers.Register)
	router.POST("/api/login", controllers.Login)
	router.POST("/api/google", controllers.GoogleSignIn)

	// Protected routes
	protected := router.Group("/api")
	protected.Use(middlewares.JWTAuthMiddleware())
	{
		protected.GET("/me", controllers.GetCurrentUser)
	}

	router.Run()
}
