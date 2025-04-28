package utils

import (
    "fmt"
    "net/http"
    "os"
    "time"

    "github.com/golang-jwt/jwt/v4"
)

func GenerateToken(userID string, role string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "role":    role,
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    })

    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        return "", fmt.Errorf("JWT_SECRET is not set")
    }

    return token.SignedString([]byte(secret))
}

func ExtractUserIDFromRequest(r *http.Request) (string, error) {
    cookie, err := r.Cookie("token")
    if err != nil {
        return "", fmt.Errorf("missing token")
    }

    tokenStr := cookie.Value
    token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
        return []byte(os.Getenv("JWT_SECRET")), nil
    })
    if err != nil || !token.Valid {
        return "", fmt.Errorf("invalid token")
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        return "", fmt.Errorf("invalid claims")
    }

    userID, ok := claims["user_id"].(string)
    if !ok {
        return "", fmt.Errorf("user_id not found in token")
    }

    return userID, nil
}
