import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API service
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    signup: (data) => api.post('/auth/signup', data),
    doctorSignup: (data) => api.post('/auth/doctor-signup', data),
    googleAuth: () => api.get('/auth/google'),
    facebookAuth: () => api.get('/auth/facebook'),
    verifyToken: () => api.get('/auth/verify'),
    logout: () => api.post('/auth/logout'),
};

// Patient API service
export const patientAPI = {
    createPatient: (data) => api.post('/patients', data),
    getPatient: (id) => api.get(`/patients/${id}`),
    updatePatient: (id, data) => api.put(`/patients/${id}`, data),
    deletePatient: (id) => api.delete(`/patients/${id}`),
    getPatientAppointments: (id) => api.get(`/patients/${id}/appointments`),
};

// Doctor API service
export const doctorAPI = {
    createDoctor: (data) => api.post('/doctors', data),
    getDoctor: (id) => api.get(`/doctors/${id}`),
    updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
    deleteDoctor: (id) => api.delete(`/doctors/${id}`),
    getDoctorAppointments: (id) => api.get(`/doctors/${id}/appointments`),
};

// Appointment API service
export const appointmentAPI = {
    createAppointment: (data) => api.post('/appointments', data),
    getAppointment: (id) => api.get(`/appointments/${id}`),
    updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
    deleteAppointment: (id) => api.delete(`/appointments/${id}`),
    getAvailableSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}?date=${date}`),
};

// Message API service
export const messageAPI = {
    sendMessage: (data) => api.post('/messages', data),
    getMessage: (id) => api.get(`/messages/${id}`),
    getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
    deleteMessage: (id) => api.delete(`/messages/${id}`),
};

// Prescription API service
export const prescriptionAPI = {
    createPrescription: (data) => api.post('/prescriptions', data),
    getPrescription: (id) => api.get(`/prescriptions/${id}`),
    updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),
    deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
};

export default api; 