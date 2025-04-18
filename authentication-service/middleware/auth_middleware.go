package middleware

import (
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v4"
)

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// ✅ خد التوكن من الـ Cookie
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "❌ Missing token cookie", http.StatusUnauthorized)
			return
		}

		tokenStr := cookie.Value

		// ✅ فك التوكن
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("❌ Unexpected signing method")
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "❌ Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// ✅ لو حبيت تحط الـ user info في context، تقدر تضيفه هنا بعدين

		next.ServeHTTP(w, r)
	})
}
func RequireRole(role string, next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "❌ Missing token", http.StatusUnauthorized)
			return
		}
		tokenStr := cookie.Value

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "❌ Invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "❌ Invalid claims", http.StatusUnauthorized)
			return
		}

		userRole, ok := claims["role"].(string)
		if !ok || userRole != role {
			http.Error(w, "⛔ Access denied: insufficient role", http.StatusForbidden)
			return
		}

		// ✅ السماح بالدخول
		next.ServeHTTP(w, r)
	})
}
