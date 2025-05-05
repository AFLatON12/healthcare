package handlers

import (
	"github.com/gin-gonic/gin"
)

// GinHandler wraps existing handler structs to gin.HandlerFunc

type GinAuthHandler struct {
	AuthHandler *AuthHandler
}

func NewGinAuthHandler(authHandler *AuthHandler) *GinAuthHandler {
	return &GinAuthHandler{AuthHandler: authHandler}
}

func (g *GinAuthHandler) RegisterPatient(c *gin.Context) {
	g.AuthHandler.RegisterPatient(c.Writer, c.Request)
}

func (g *GinAuthHandler) Login(c *gin.Context) {
	g.AuthHandler.Login(c.Writer, c.Request)
}

func (g *GinAuthHandler) GoogleLogin(c *gin.Context) {
	g.AuthHandler.GoogleLogin(c.Writer, c.Request)
}

func (g *GinAuthHandler) GoogleCallback(c *gin.Context) {
	g.AuthHandler.GoogleCallback(c.Writer, c.Request)
}

func (g *GinAuthHandler) GetCurrentUser(c *gin.Context) {
	// Implement if AuthHandler has GetCurrentUser method, else omit or return 501
	// For now, return 501 Not Implemented
	c.JSON(501, gin.H{"error": "Not implemented"})
}
