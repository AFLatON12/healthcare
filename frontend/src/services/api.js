import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';
const APPOINTMENT_API_URL = 'http://localhost:8080';
const TRANSACTION_API_URL = 'http://localhost:8081';

// Create axios instances for each service
const authApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

const appointmentApi = axios.create({
    baseURL: APPOINTMENT_API_URL,
    withCredentials: true,
});

const transactionApi = axios.create({
    baseURL: TRANSACTION_API_URL,
    withCredentials: true,
});

// Auth Service
export const authService = {
    login: async (credentials) => {
        const response = await authApi.post('/api/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await authApi.post('/api/patient/register', userData);
        return response.data;
    },
    logout: async () => {
        const response = await authApi.post('/api/logout');
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await authApi.get('/api/me');
        return response.data;
    },
};

// Appointment Service
export const appointmentService = {
    getAppointments: async () => {
        const response = await appointmentApi.get('/appointments');
        return response.data;
    },
    createAppointment: async (appointmentData) => {
        const response = await appointmentApi.post('/appointments', appointmentData);
        return response.data;
    },
    updateAppointment: async (id, appointmentData) => {
        const response = await appointmentApi.put(`/appointments/${id}`, appointmentData);
        return response.data;
    },
    deleteAppointment: async (id) => {
        const response = await appointmentApi.delete(`/appointments/${id}`);
        return response.data;
    },
    getDoctorSchedule: async (doctorId) => {
        const response = await appointmentApi.get(`/doctors/${doctorId}/schedule`);
        return response.data;
    },
};

// Transaction Service
export const transactionService = {
    createTransaction: async (transactionData) => {
        const response = await transactionApi.post('/transactions', transactionData);
        return response.data;
    },
    getTransactions: async () => {
        const response = await transactionApi.get('/transactions');
        return response.data;
    },
    getTransactionById: async (id) => {
        const response = await transactionApi.get(`/transactions/${id}`);
        return response.data;
    },
};

// Add request interceptor for error handling
const addErrorInterceptor = (api) => {
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Handle unauthorized access
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

addErrorInterceptor(authApi);
addErrorInterceptor(appointmentApi);
addErrorInterceptor(transactionApi);

// Patient API service
export const patientAPI = {
    createPatient: (data) => authApi.post('/patients', data),
    getPatient: (id) => authApi.get(`/patients/${id}`),
    updatePatient: (id, data) => authApi.put(`/patients/${id}`, data),
    deletePatient: (id) => authApi.delete(`/patients/${id}`),
    getPatientAppointments: (id) => authApi.get(`/patients/${id}/appointments`),
};

// Doctor API service
export const doctorAPI = {
    createDoctor: (data) => authApi.post('/doctors', data),
    getDoctor: (id) => authApi.get(`/doctors/${id}`),
    updateDoctor: (id, data) => authApi.put(`/doctors/${id}`, data),
    deleteDoctor: (id) => authApi.delete(`/doctors/${id}`),
    getDoctorAppointments: (id) => authApi.get(`/doctors/${id}/appointments`),
};

// Appointment API service
export const appointmentAPI = {
    getAvailableSlots: (doctorId, date) => appointmentApi.get(`/slots/${doctorId}?date=${date}`),
};

// Message API service
export const messageAPI = {
    sendMessage: (data) => authApi.post('/messages', data),
    getMessage: (id) => authApi.get(`/messages/${id}`),
    getConversation: (userId) => authApi.get(`/messages/conversation/${userId}`),
    deleteMessage: (id) => authApi.delete(`/messages/${id}`),
};

// Prescription API service
export const prescriptionAPI = {
    createPrescription: (data) => authApi.post('/prescriptions', data),
    getPrescription: (id) => authApi.get(`/prescriptions/${id}`),
    updatePrescription: (id, data) => authApi.put(`/prescriptions/${id}`, data),
    deletePrescription: (id) => authApi.delete(`/prescriptions/${id}`),
};

export default authApi; 