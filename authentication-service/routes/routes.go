package routes

import (
	"auth-service/controllers"
	"auth-service/middleware"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()
    // ✅ Authentication routes
    r.HandleFunc("/api/login", controllers.LoginHandler).Methods("POST")
    r.HandleFunc("/api/profile", middleware.RequireAuth(controllers.ProfileHandler)).Methods("GET")
    r.HandleFunc("/api/logout", middleware.RequireAuth(controllers.LogoutHandler)).Methods("POST")
    r.HandleFunc("/api/change-password", middleware.RequireAuth(controllers.ChangePasswordHandler)).Methods("POST")
    r.HandleFunc("/api/forgot-password", controllers.ForgotPasswordHandler).Methods("POST")
    r.HandleFunc("/api/reset-password", controllers.ResetPasswordHandler).Methods("POST")


    // ✅ Doctor routes
    r.HandleFunc("/api/doctor/register", controllers.DoctorRegisterHandler).Methods("POST")
    r.HandleFunc("/api/doctor/zone", middleware.RequireRole("doctor", controllers.DoctorZoneHandler)).Methods("GET")
    r.HandleFunc("/api/doctor/update-profile", middleware.RequireRole("doctor", controllers.UpdateDoctorProfileHandler)).Methods("PUT")

    // ✅ Patient routes
    r.HandleFunc("/api/patient/register", controllers.PatientRegisterHandler).Methods("POST")
    r.HandleFunc("/api/patient/zone", middleware.RequireRole("patient", controllers.PatientZoneHandler)).Methods("GET")
    r.HandleFunc("/api/patient/update-profile", middleware.RequireRole("patient", controllers.UpdatePatientProfileHandler)).Methods("PUT")


    // ✅ Admin routes
    r.HandleFunc("/api/admin/zone", middleware.RequireRole("admin", controllers.AdminZoneHandler)).Methods("GET")
    r.HandleFunc("/api/admin/update-profile", middleware.RequireRole("admin", controllers.UpdateAdminProfileHandler)).Methods("PUT")

	r.HandleFunc("/api/superadmin/zone", middleware.RequireRole("super_admin", controllers.SuperAdminZoneHandler)).Methods("GET")
	
    
    r.HandleFunc("/api/superadmin/create-admin", middleware.RequireRole("super_admin", controllers.CreateAdminHandler)).Methods("POST")
    r.HandleFunc("/api/superadmin/add-permission", middleware.RequireRole("super_admin", controllers.AddPermissionHandler)).Methods("POST")
    r.HandleFunc("/api/superadmin/remove-permission", middleware.RequireRole("super_admin", controllers.RemovePermissionHandler)).Methods("POST")
    r.HandleFunc("/api/superadmin/update-permissions", middleware.RequireRole("super_admin", controllers.UpdatePermissionsHandler)).Methods("PUT")


	return r
}
