import React from 'react';
import { authStore } from '../store/authStore';

const DashboardPage = () => {
    const user = authStore((s) => s.user);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Bảng điều khiển</h1>
            <p className="text-gray-600">
                Xin chào, {user?.name}. Trang này dành cho người tham gia đã đăng nhập.
            </p>
        </div>
    );
};

export default DashboardPage;
