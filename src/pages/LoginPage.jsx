import React, { useState } from 'react';
import { Mail, Lock, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Thư viện hiển thị thông báo (Alert) dạng Toast trượt siêu đẹp

// Giữ nguyên đường dẫn import từ hệ thống dự án để kết nối API và global state Zustand
import api from '../services/api'; 
import { authStore } from '../store/authStore'; 

const LoginPage = () => {
  const navigate = useNavigate();
  
  // Lấy hàm setAuth từ Zustand store toàn cục để lưu thông tin User và Token sau khi đăng nhập thành công
  const setAuth = authStore((s) => s.setAuth); 

  // Gộp các trường nhập liệu (Email, Password) vào chung một State Object để quản lý dữ liệu gọn gàng
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State quản lý mảng lỗi Validation trả về từ Form Request của Laravel (HTTP 422)
  const [errors, setErrors] = useState({});
  // State quản lý trạng thái xoay vòng loading của nút bấm khi đang đợi API phản hồi
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý kích hoạt khi người dùng nhấn nút bấm đăng nhập (Sign In)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn cơ chế reload trang mặc định của trình duyệt
    setIsLoading(true); // Bật trạng thái Loading xoay tròn trên nút bấm
    setErrors({});      // Làm sạch mảng lỗi cũ trước khi thực hiện request mới

    try {
      // ĐÃ SỬA: Đính kèm thêm trường 'required_role' vào body gửi lên để thỏa mãn điều kiện validate của Laravel
      const requestData = {
        ...formData,
        required_role: 'attendee' // Form này là Attendee Portal nên gửi cứng vai trò là 'attendee' lên backend
      };

      // Gửi request kèm theo cục requestData mới lên API login của Attendee
      const response = await api.post('/attendee/login', requestData); 
      
      // Bóc tách dữ liệu linh hoạt, phòng trường hợp backend bọc dữ liệu trong nhánh data lồng (.data.data)
      const userData = response.data.user || response.data.data?.user;
      const tokenData = response.data.token || response.data.data?.token;

      // Bẫy lỗi bảo vệ: Nếu Backend xác thực đúng nhưng không trả về chuỗi Token mã hóa Sanctum
      if (!tokenData) {
        toast.error('Authentication failure: Token not provided by server.', { position: 'top-right' });
        setIsLoading(false);
        return;
      }

      // Hiển thị thông báo đăng nhập thành công tuyệt đẹp bằng tiếng Anh thông qua Hot-Toast
      toast.success('Login successful! Welcome back to EventHub.', {
        position: 'top-right',
        duration: 3000
      });
      
      // Đồng bộ dữ liệu User và Token nhận về từ API vào global state Zustand Store để các trang sau sử dụng
      setAuth(userData, tokenData);
      
      // LUỒNG XỬ LÝ: Đợi 1.5 giây để hiệu ứng Toast chạy xong, sau đó chuyển hướng thẳng về trang chủ (Dashboard)
      setTimeout(() => {
        navigate('/'); 
      }, 1500);

    } catch (err) {
      // Nhánh 1: Bắt lỗi Validation Form của Laravel FormRequest (HTTP 422 - Khi thiếu trường hoặc sai định dạng)
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {}); // Map chi tiết mảng lỗi vào từng ô input tương ứng
        toast.error('Validation failed. Please check the fields below.', { position: 'top-right' });
      } 
      // Nhánh 2: Bắt lỗi sai tài khoản mật khẩu (HTTP 401 Unauthorized) hoặc chặn chéo sai Role (HTTP 403 Forbidden) từ Laravel
      else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        toast.error(err.response.data.message || 'Invalid credentials or unauthorized role!', { position: 'top-right' });
      } 
      // Nhánh 3: Xử lý các lỗi hệ thống ngầm, lỗi kết nối hoặc sập cơ sở dữ liệu (HTTP 500)
      else {
        toast.error(err.response?.data?.message || 'Server connection error. Please try again later.', { position: 'top-right' });
      }
    } finally {
      setIsLoading(false); // Tắt hiệu ứng loading sau khi xử lý xong (Bất kể chạy thành công hay thất bại)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-[#2D3748]">
      {/* Component bắt buộc của thư viện react-hot-toast để hiển thị thông báo trượt ra màn hình */}
      <Toaster />

      {/* Main Card Container - Khung chứa cấu trúc thiết kế của Form */}
      <div className="bg-[#FAF4F4] p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 w-full max-w-[480px]">
        
        {/* Branding & Header - Phần nhận diện thương hiệu của EventHub */}
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
            Sign in to your account to participate in community events.
          </p>
        </div>

        {/* Login Form - Khởi đầu biểu mẫu điền thông tin */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Ô nhập Địa chỉ Email */}
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
                required
              />
            </div>
            {/* Vùng hiển thị thông báo lỗi cụ thể dành cho trường Email từ Backend */}
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium italic">*{errors.email[0]}</p>}
          </div>

          {/* Ô nhập Mật khẩu */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#800020] w-5 h-5 transition-colors" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020] transition-all placeholder:text-gray-300"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            {/* Vùng hiển thị thông báo lỗi cụ thể dành cho trường Password từ Backend */}
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium italic">*{errors.password[0]}</p>}
          </div>

          {/* Nút gửi thông tin Đăng Nhập kèm xử lý trạng thái quay vòng Loading khi click */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#800020] text-white py-4 rounded-xl font-bold text-base hover:bg-[#600018] transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-70 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                {/* SVG Vòng xoay chuyển động (Spinner Icon) khi đang đợi phản hồi */}
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Khung liên kết chuyển hướng nhanh dành cho người dùng chưa có tài khoản */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#800020] font-extrabold hover:underline underline-offset-4">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;