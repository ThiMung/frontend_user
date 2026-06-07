import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/attendee/login', {
      ...credentials,
      required_role: 'attendee',
    });
    return response.data;
  },

  googleLogin: async (accessToken) => {
    const response = await api.post('/attendee/auth/google', { credential: accessToken });
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/attendee/register', data);
    return response.data;
  },

  logout: () => api.post('/logout'),
};