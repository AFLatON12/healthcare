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

func (g *GinAuthHandler) Register(c *gin.Context) {
	g.AuthHandler.Register(c.Writer, c.Request)
}

func (g *GinAuthHandler) Login(c *gin.Context) {
	g.AuthHandler.Login(c.Writer, c.Request)
}

func (g *GinAuthHandler) GoogleSignIn(c *gin.Context) {
	g.AuthHandler.GoogleSignIn(c.Writer, c.Request)
}

func (g *GinAuthHandler) GetCurrentUser(c *gin.Context) {
	g.AuthHandler.GetCurrentUser(c.Writer, c.Request)
}
