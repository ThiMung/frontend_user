import api from './api';

export const authService = {
    login: async (credentials) => {
        // Gửi kèm required_role để Backend chặn Organizer đăng nhập vào đây
        const response = await api.post('/attendee/login', {
            ...credentials,
            required_role: 'attendee'
        });
        return response.data;
    },
    register: async (data) => {
        const response = await api.post('/attendee/register', data);
        return response.data;
    },
    logout: () => api.post('/logout')
};