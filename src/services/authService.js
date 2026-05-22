import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/attendee/login', {
      ...credentials,
      // Backend dùng role này để chặn đăng nhập nhầm cổng
      required_role: 'attendee',
    });

    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/attendee/register', data);

    return response.data;
  },

  logout: () => api.post('/logout'),
};