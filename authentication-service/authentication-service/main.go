package main

import (
	"auth-service/db"
	"auth-service/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Error loading .env file")
	}

	db.ConnectMongoDB()
	router := routes.SetupRoutes()

	// ✅ لف الـ router بميدل وير CORS مظبوط
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		// أو http://127.0.0.1:5500
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// ✅ مرر الطلب فعلاً للراوتر
		router.ServeHTTP(w, r)
	})

	log.Println("✅ Auth Service running on port:", os.Getenv("PORT"))
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), handler))
}
