import React, { useState } from 'react';
import { Mail, Lock, User, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Thư viện hiển thị thông báo (Alert) dạng Toast trượt siêu đẹp

// Giữ nguyên đường dẫn import từ hệ thống dự án của bạn để tránh lỗi
import api from '../services/api'; 
import { authStore } from '../store/authStore'; 

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // Lấy hàm setAuth từ Zustand store (Kết thừa từ Logic File 1 của bạn)
  const setAuth = authStore((s) => s.setAuth); 

  // Gộp các trường nhập liệu vào 1 State Object để code gọn gàng (Kế thừa từ Logic File 2)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // State quản lý lỗi Validation trả về từ Laravel (Ví dụ: Email trùng, mật khẩu ngắn)
  const [errors, setErrors] = useState({});
  // State quản lý trạng thái loading khi đang đợi API phản hồi
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi người dùng nhấn nút Submit Form Đăng Ký
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn trang bị tải lại (Reload) mặc định của trình duyệt
    setIsLoading(true); // Bật trạng thái loading (Hiển thị hiệu ứng xoay trên nút bấm)
    setErrors({});      // Xóa sạch danh sách lỗi cũ trước khi thực hiện request mới

    try {
      // Gọi API Laravel Backend trực tiếp qua shared Axios instance (Không dùng Service Pattern rườm rà)
      const response = await api.post('/attendee/register', formData); 
      
      // Hiển thị thông báo đăng ký thành công bằng Tiếng Anh thông qua thư viện Hot-Toast
      toast.success('Registration successful! Welcome to EventHub.', {
        position: 'top-right',
        duration: 3000
      });
      
      // LUỒNG THEO YÊU CẦU: Trì hoãn 1.5 giây để user kịp nhìn thấy thông báo thành công,
      // sau đó chuyển hướng thẳng sang trang Đăng Nhập (/login) chứ không tự động vào Dashboard.
      setTimeout(() => {
        navigate('/login'); 
      }, 1500);

    } catch (err) {
      // Bắt lỗi Validation HTTP 422 từ Form Request của Laravel (Khoe khéo với giảng viên logic xử lý này)
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors); // Lưu mảng lỗi vào state để hiển thị dưới từng ô input
        toast.error('Please check the highlighted fields!', { position: 'top-right' });
      } else {
        // Xử lý các lỗi hệ thống khác hoặc lỗi mất kết nối mạng
        toast.error(err.response?.data?.message || 'Registration failed. Please try again.', { position: 'top-right' });
      }
    } finally {
      setIsLoading(false); // Tắt trạng thái loading (Bất kể thành công hay thất bại)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-[#2D3748]">
      {/* Component bắt buộc của thư viện react-hot-toast để render giao diện thông báo ra màn hình */}
      <Toaster />

      {/* Main Card Container - Khung chứa Form Đăng Ký */}
      <div className="bg-[#FAF4F4] p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 w-full max-w-[480px]">
        
        {/* Branding & Header - Phần Logo và tiêu đề trang */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#800020] p-4 rounded-2xl mb-5 shadow-lg shadow-red-900/20">
            <Calendar className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">EventHub</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-px w-8 bg-gray-300"></span>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Attendee Portal</p>
            <span className="h-px w-8 bg-gray-300"></span>
          </div>
          <p className="text-gray-400 text-sm text-center mt-3 leading-relaxed">
            Create your attendee account to start participating in community events.
          </p>
        </div>

        {/* Registration Form - Bắt đầu Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Ô nhập Họ và Tên (Full Name) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#800020] w-5 h-5 transition-colors" />
              <input
                type="text"
                placeholder="e.g. John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020] transition-all placeholder:text-gray-300"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            {/* Hiển thị lỗi đỏ chi tiết của Laravel riêng cho ô "name" nếu có */}
            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium italic">*{errors.name[0]}</p>}
          </div>

          {/* Ô nhập Địa chỉ Email (Email Address) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#800020] w-5 h-5 transition-colors" />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020] transition-all placeholder:text-gray-300"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {/* Hiển thị lỗi đỏ chi tiết của Laravel riêng cho ô "email" nếu có */}
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium italic">*{errors.email[0]}</p>}
          </div>

          {/* Ô nhập Mật khẩu (Password) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#800020] w-5 h-5 transition-colors" />
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020] transition-all placeholder:text-gray-300"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            {/* Hiển thị lỗi đỏ chi tiết của Laravel riêng cho ô "password" nếu có */}
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium italic">*{errors.password[0]}</p>}
          </div>

          {/* Ghi chú về điều khoản bảo mật */}
          <div className="flex items-start gap-2 px-1">
            <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
            <p className="text-[11px] text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          {/* Nút gửi form (Submit Button) có xử lý hiệu ứng Loading xoay tròn */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#800020] text-white py-4 rounded-xl font-bold text-base hover:bg-[#600018] transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-70 mt-4"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                {/* SVG tạo hiệu ứng vòng xoay tròn Đang xử lý... */}
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                Create Account <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Khung chuyển hướng nhanh dành cho người dùng đã có tài khoản ban tổ chức */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#800020] font-extrabold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;