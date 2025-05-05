const API_BASE_URL = "http://localhost:8000/api/v1";

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorMessage = "Login failed";
    const errorText = await response.clone().text();
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

export async function registerPatient(patientData) {
  const response = await fetch(`${API_BASE_URL}/patients/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    let errorMessage = "Registration failed";
    const errorText = await response.clone().text();
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

export async function registerDoctor(doctorData) {
  const response = await fetch(`${API_BASE_URL}/doctors/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doctorData),
  });

  if (!response.ok) {
    let errorMessage = "Doctor registration failed";
    const errorText = await response.clone().text();
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

export function getGoogleLoginUrl() {
  return `${API_BASE_URL}/auth/google`;
}

export async function loginWithGoogle(accessToken) {
  // Placeholder function to maintain compatibility with existing imports
  // The new OAuth flow uses getGoogleLoginUrl and loginWithGoogleCallback instead
  throw new Error("loginWithGoogle is deprecated. Use OAuth flow with getGoogleLoginUrl and loginWithGoogleCallback.");
}

export async function loginWithGoogleCallback(code) {
  // This function should handle the OAuth callback with the code parameter
  // Implementation depends on frontend OAuth flow handling
  // Placeholder for now
  throw new Error("Google login callback handling not implemented");
}

export async function fetchPatientById(patientId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch patient data";
    if (response.status === 401) {
      errorMessage = "Unauthorized: Token is missing, invalid, or expired.";
    }
    const errorText = await response.clone().text();
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

export async function refreshToken(oldToken) {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: oldToken }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to refresh token";
    if (response.status === 401) {
      errorMessage = "Unauthorized: Refresh token is missing, invalid, or expired.";
    }
    const errorText = await response.clone().text();
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.token;
}
