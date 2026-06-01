import api from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/attendee/notifications');

    return response.data?.notifications || [];
  },

  getUnreadCount: async () => {
    const response = await api.get('/attendee/notifications/unread-count');

    return response.data?.unread_count || 0;
  },

  markAsRead: async (notificationId) => {
    const response = await api.patch(`/attendee/notifications/${notificationId}/read`);

    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/attendee/notifications/read-all');

    return response.data;
  },
};
