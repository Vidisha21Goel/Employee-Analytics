import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Employee APIs
export const addEmployee = (data) => API.post('/employees', data);
export const getAllEmployees = () => API.get('/employees');
export const searchEmployees = (params) => API.get('/employees/search', { params });
export const getEmployeeById = (id) => API.get(`/employees/${id}`);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);
export const getEmployeeRankings = () => API.get('/employees/rankings');

// Auth APIs
export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// AI APIs
export const getAIRecommendation = (employeeId) => API.post('/ai/recommend', { employeeId });
export const rankAllEmployees = () => API.post('/ai/rank-all');
