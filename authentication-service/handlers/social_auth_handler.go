package handlers

import (
	"encoding/json"
	"net/http"

	"healthcare/authentication-service/services"
)

type SocialAuthHandler struct {
	socialAuthService *services.SocialAuthService
	authService       *services.AuthService
}

func NewSocialAuthHandler(socialAuthService *services.SocialAuthService, authService *services.AuthService) *SocialAuthHandler {
	return &SocialAuthHandler{
		socialAuthService: socialAuthService,
		authService:       authService,
	}
}

func (h *SocialAuthHandler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	url := h.socialAuthService.GetGoogleAuthURL()
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *SocialAuthHandler) FacebookLogin(w http.ResponseWriter, r *http.Request) {
	url := h.socialAuthService.GetFacebookAuthURL()
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *SocialAuthHandler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Authorization code not found", http.StatusBadRequest)
		return
	}

	userInfo, err := h.socialAuthService.HandleGoogleCallback(code)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	patient, err := h.socialAuthService.CreateOrUpdatePatientFromSocial(userInfo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Generate JWT token
	token, err := h.authService.GenerateToken(patient.ID, patient.Email, "patient", []string{"patient:self"})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":         patient.ID.Hex(),
			"email":      patient.Email,
			"name":       patient.Name,
			"role":       "patient",
			"provider":   userInfo.Provider,
			"avatar_url": userInfo.AvatarURL,
		},
	})
}

func (h *SocialAuthHandler) FacebookCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Authorization code not found", http.StatusBadRequest)
		return
	}

	userInfo, err := h.socialAuthService.HandleFacebookCallback(code)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	patient, err := h.socialAuthService.CreateOrUpdatePatientFromSocial(userInfo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Generate JWT token
	token, err := h.authService.GenerateToken(patient.ID, patient.Email, "patient", []string{"patient:self"})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":         patient.ID.Hex(),
			"email":      patient.Email,
			"name":       patient.Name,
			"role":       "patient",
			"provider":   userInfo.Provider,
			"avatar_url": userInfo.AvatarURL,
		},
	})
}
