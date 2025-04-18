package routes

import (
	"auth-service/controllers"
	"auth-service/middleware"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/api/register", controllers.RegisterHandler).Methods("POST")
	r.HandleFunc("/api/login", controllers.LoginHandler).Methods("POST")
	r.HandleFunc("/api/profile", middleware.RequireAuth(controllers.ProfileHandler)).Methods("GET")
	r.HandleFunc("/api/logout", controllers.LogoutHandler).Methods("POST")
	r.HandleFunc("/api/doctor-zone", middleware.RequireRole("doctor", controllers.DoctorZoneHandler)).Methods("GET")
	r.HandleFunc("/api/patient-zone", middleware.RequireRole("patient", controllers.PatientZoneHandler)).Methods("GET")
	r.HandleFunc("/api/admin-zone", middleware.RequireRole("admin", controllers.AdminZoneHandler)).Methods("GET")
	r.HandleFunc("/api/change-password", middleware.RequireAuth(controllers.ChangePasswordHandler)).Methods("POST")

	return r
}
