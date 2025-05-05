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

func (g *GinAuthHandler) GetCurrentUser(c *gin.Context) {
	// Implement if AuthHandler has GetCurrentUser method, else omit or return 501
	// For now, return 501 Not Implemented
	c.JSON(501, gin.H{"error": "Not implemented"})
}

type GinSocialAuthHandler struct {
	SocialAuthHandler *SocialAuthHandler
}

func NewGinSocialAuthHandler(socialAuthHandler *SocialAuthHandler) *GinSocialAuthHandler {
	return &GinSocialAuthHandler{SocialAuthHandler: socialAuthHandler}
}

func (g *GinSocialAuthHandler) GoogleLogin(c *gin.Context) {
	g.SocialAuthHandler.GoogleLogin(c.Writer, c.Request)
}

func (g *GinSocialAuthHandler) GoogleCallback(c *gin.Context) {
	g.SocialAuthHandler.GoogleCallback(c.Writer, c.Request)
}
