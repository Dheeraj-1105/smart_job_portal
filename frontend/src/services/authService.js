import api from "../api/axios";

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { email, password, role, firstName, lastName }
   */
  register: async (userData) => {
    console.log("[AUTH] Register request:", { ...userData, password: '***' });
    const response = await api.post("/api/auth/register", userData);
    console.log("[AUTH] Register response:", response.data);
    return response.data;
  },

  /**
   * Login an existing user
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    console.log("[AUTH] Login request:", { ...credentials, password: '***' });
    const response = await api.post("/api/auth/login", credentials);
    console.log("[AUTH] Login response:", response.data);
    return response.data;
  },
};

export default authService;
