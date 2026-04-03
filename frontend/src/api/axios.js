import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4040',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error Captured:", error);

        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('name');

                const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
                if (!isAuthPage) {
                    window.location.href = '/login';
                }
            } else if (status === 403) {
                console.error("Unauthorized access to this resource.");
            } else if (status >= 500) {
                console.error("Internal Server Error:", data);
            }
        } else if (error.request) {
            console.error("Network Error: No response received from server.");
        }

        return Promise.reject(error);
    }
);

export default api;
