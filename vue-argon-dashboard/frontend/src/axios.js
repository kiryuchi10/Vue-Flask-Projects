// src/axios.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/',  // Your Flask API base URL
});

// Request interceptor
axiosInstance.interceptors.request.use(request => {
  console.log(`Sending ${request.method} request to ${request.url}`);
  console.log('Request Headers:', request.headers);
  console.log('Request Data:', request.data);
  return request;
});

// Response interceptor
axiosInstance.interceptors.response.use(response => {
  console.log(`Received response with status ${response.status}`);
  console.log('Response Headers:', response.headers);
  console.log('Response Data:', response.data);
  return response;
}, error => {
  console.log('Error response:', error.response);
  return Promise.reject(error);
});

export default axiosInstance;
