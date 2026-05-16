import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { authStore } from '../store/authStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const setAuth = authStore((s) => s.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login({ email, password });
            setAuth(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>
            <p className="mt-4 text-sm text-gray-500">
                Chưa có tài khoản? <Link to="/register" className="text-blue-600">Đăng ký</Link>
            </p>
        </div>
    );
};

export default LoginPage;
