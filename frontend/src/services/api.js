import axios from 'axios';

// Get API base URL from Vite environment variables
// Local development uses .env.development
// Production build uses .env.production (or Vercel environment variables)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

if (import.meta.env.DEV) {
  console.log('Development mode: API base URL is', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Timetable APIs
export const timetableAPI = {
  getAll: () => api.get('/timetable/all'),
  getForStudent: (branch, year, section, day = null) => {
    const params = { branch, year, section };
    if (day) params.day = day;
    return api.get('/timetable', { params });
  },
  create: (data) => api.post('/timetable', data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  delete: (id) => api.delete(`/timetable/${id}`),
};

// Notes APIs
export const notesAPI = {
  getAll: () => api.get('/notes'),
  getBySubject: (subject) => api.get('/notes', { params: { subject } }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) =>
    api.post('/notes', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  download: (fileName) =>
    api.get(`/notes/download/${fileName}`, {
      responseType: 'blob',
    }),
};

// Doubts APIs
export const doubtsAPI = {
  getAll: () => api.get('/doubts'),
  getBySubject: (subject) => api.get('/doubts', { params: { subject } }),
  getByResolved: (resolved) => api.get('/doubts', { params: { resolved } }),
  getById: (id) => api.get(`/doubts/${id}`),
  create: (data) => api.post('/doubts', data),
  addReply: (id, reply) => api.post(`/doubts/${id}/reply`, reply),
  upvote: (id) => api.put(`/doubts/${id}/upvote`),
  resolve: (id) => api.put(`/doubts/${id}/resolve`),
  delete: (id) => api.delete(`/doubts/${id}`),
};

// Notices APIs
export const noticesAPI = {
  getAll: () => api.get('/notices'),
  getByCategory: (category) => api.get('/notices', { params: { category } }),
  getById: (id) => api.get(`/notices/${id}`),
  create: (data) => api.post('/notices', data),
  update: (id, data) => api.put(`/notices/${id}`, data),
  delete: (id) => api.delete(`/notices/${id}`),
};

// Attendance APIs
export const attendanceAPI = {
  createSession: (data) => api.post('/attendance/session', data),
  closeSession: (id) => api.put(`/attendance/session/${id}/close`),
  getFacultySessions: (facultyId) =>
    api.get(`/attendance/session/faculty/${facultyId}`),
  markAttendance: (data) => api.post('/attendance/mark', data),
  markBulkAttendance: (data) => api.post('/attendance/mark/bulk', data),
  getStudentsByClass: (branch, year, section) =>
    api.get('/attendance/students', { params: { branch, year, section } }),
  uploadStudents: (data) => api.post('/attendance/students/upload', data),
  getSessionAttendance: (sessionId) =>
    api.get(`/attendance/session/${sessionId}/attendance`),
  getActiveSessions: (branch, year, section) =>
    api.get('/attendance/session/active', { params: { branch, year, section } }),
  getStudentAttendance: (studentId) =>
    api.get(`/attendance/student/${studentId}`),
  getStudentStats: (studentId) =>
    api.get(`/attendance/student/${studentId}/stats`),
  getSession: (sessionId) => api.get(`/attendance/session/${sessionId}`),
  getAllActiveSessions: () => api.get('/attendance/session/all/active'),
};

export default api;