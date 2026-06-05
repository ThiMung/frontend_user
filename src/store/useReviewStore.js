import { create } from 'zustand';
import api from '../services/api'; // Axios instance đã được config token + handle 401

export const useReviewStore = create((set) => ({
    reviews: [],
    isLoading: false,
    error: null,

    // Gọi API lấy danh sách đánh giá
    fetchReviews: async (eventId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/events/${eventId}/reviews`);
            set({ reviews: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Lỗi khi tải đánh giá', isLoading: false });
        }
    },

    // Gọi API gửi đánh giá mới
    submitReview: async (eventId, reviewData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/events/${eventId}/reviews`, reviewData);
            
            // Thêm review mới vào đầu danh sách đang hiển thị
            set((state) => ({
                reviews: [response.data.data, ...state.reviews],
                isLoading: false
            }));
            
            return { success: true, message: response.data.message };
        } catch (error) {
            set({ error: error.response?.data?.message || 'Lỗi khi gửi đánh giá', isLoading: false });
            return { success: false, message: error.response?.data?.message };
        }
    }
}));
