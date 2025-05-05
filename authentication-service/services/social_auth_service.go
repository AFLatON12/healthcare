package services

import (
	"context"
	"encoding/json"
	"fmt"
	"healthcare/authentication-service/controllers"
	"healthcare/authentication-service/models"
	"os"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/google"
	googleoauth2 "google.golang.org/api/oauth2/v2"
)

type SocialAuthService struct {
	googleConfig   *oauth2.Config
	facebookConfig *oauth2.Config
	patientCtrl    *controllers.PatientController
}

type SocialUserInfo struct {
	ID        string
	Email     string
	Name      string
	Provider  string
	AvatarURL string
}

func NewSocialAuthService(patientCtrl *controllers.PatientController) *SocialAuthService {
	// Google OAuth2 configuration
	googleConfig := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	// Facebook OAuth2 configuration
	facebookConfig := &oauth2.Config{
		ClientID:     os.Getenv("FACEBOOK_CLIENT_ID"),
		ClientSecret: os.Getenv("FACEBOOK_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("FACEBOOK_REDIRECT_URL"),
		Scopes:       []string{"email", "public_profile"},
		Endpoint:     facebook.Endpoint,
	}

	return &SocialAuthService{
		googleConfig:   googleConfig,
		facebookConfig: facebookConfig,
		patientCtrl:    patientCtrl,
	}
}

func (s *SocialAuthService) GetGoogleAuthURL() string {
	return s.googleConfig.AuthCodeURL("state", oauth2.AccessTypeOffline)
}

func (s *SocialAuthService) GetFacebookAuthURL() string {
	return s.facebookConfig.AuthCodeURL("state", oauth2.AccessTypeOffline)
}

func (s *SocialAuthService) HandleGoogleCallback(code string) (*SocialUserInfo, error) {
	token, err := s.googleConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange token: %v", err)
	}

	client := s.googleConfig.Client(context.Background(), token)
	service, err := googleoauth2.New(client)
	if err != nil {
		return nil, fmt.Errorf("failed to create oauth2 service: %v", err)
	}

	userInfo, err := service.Userinfo.Get().Do()
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %v", err)
	}

	return &SocialUserInfo{
		ID:        userInfo.Id,
		Email:     userInfo.Email,
		Name:      userInfo.Name,
		Provider:  "google",
		AvatarURL: userInfo.Picture,
	}, nil
}

func (s *SocialAuthService) HandleFacebookCallback(code string) (*SocialUserInfo, error) {
	token, err := s.facebookConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("failed to exchange token: %v", err)
	}

	client := s.facebookConfig.Client(context.Background(), token)
	resp, err := client.Get(fmt.Sprintf("https://graph.facebook.com/me?fields=id,name,email,picture&access_token=%s", token.AccessToken))
	if err != nil {
		return nil, fmt.Errorf("failed to get user info: %v", err)
	}
	defer resp.Body.Close()

	var result struct {
		ID      string `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Picture struct {
			Data struct {
				URL string `json:"url"`
			} `json:"data"`
		} `json:"picture"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	return &SocialUserInfo{
		ID:        result.ID,
		Email:     result.Email,
		Name:      result.Name,
		Provider:  "facebook",
		AvatarURL: result.Picture.Data.URL,
	}, nil
}

func (s *SocialAuthService) CreateOrUpdatePatientFromSocial(userInfo *SocialUserInfo) (*models.Patient, error) {
	// Check if patient exists with this email
	patient, err := s.patientCtrl.GetByEmail(userInfo.Email)
	if err != nil {
		if err.Error() != "patient not found" {
			return nil, err
		}

		// Create new patient
		patient = &models.Patient{
			Name:           userInfo.Name,
			Email:          userInfo.Email,
			SocialID:       userInfo.ID,
			SocialProvider: userInfo.Provider,
			CreatedAt:      time.Now(),
		}

		if err := s.patientCtrl.Create(patient); err != nil {
			return nil, err
		}
	} else {
		// Update existing patient with social info
		patient.SocialID = userInfo.ID
		patient.SocialProvider = userInfo.Provider
		if err := s.patientCtrl.Update(patient.ID, patient); err != nil {
			return nil, err
		}
	}

	return patient, nil
}
