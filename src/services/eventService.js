import api from './api';

export const eventService = {
  getAllEvents: async (params = {}) => {
    const response = await api.get('/events', { params });

    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);

    return response.data;
  },

  registerToEvent: async (eventId) => {
    const response = await api.post('/attendee/registrations', { event_id: eventId });

    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/attendee/my-registrations');
    return response.data;
  },

  cancelRegistration: async (eventId) => {
    const response = await api.delete(`/attendee/registrations/${eventId}`);

    return response.data;
  },
};
