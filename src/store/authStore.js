import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const authStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            // Lưu user và token khi đăng nhập thành công
            setAuth: (user, token) => set({ user, token }),
            // Xóa thông tin khi đăng xuất
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'attendee-storage', // Key định danh riêng cho người tham gia
        }
    )
);