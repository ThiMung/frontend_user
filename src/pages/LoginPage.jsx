import { useState } from 'react'; 
import { ArrowRight, Calendar, Lock, Mail } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import toast, { Toaster } from 'react-hot-toast'; 
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService'; 
import { authStore } from '../store/authStore'; 
 
const initialFormData = { 
  email: '', 
  password: '', 
}; 
 
const extractAuthPayload = (data) => ({ 
  user: data?.user || data?.data?.user, 
  token: data?.token || data?.data?.token, 
}); 
 
const getLoginErrorMessage = (error) => { 
  if (error.response?.status === 401 || error.response?.status === 403) { 
    return error.response.data.message || 'Invalid credentials or unauthorized role!'; 
  } 
 
  return error.response?.data?.message || 'Server connection error. Please try again later.'; 
}; 
 
const LoginPage = () => { 
  const navigate = useNavigate(); 
  const setAuth = authStore((state) => state.setAuth); 
  const [formData, setFormData] = useState(initialFormData); 
  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false); 
 
  const updateField = (field, value) => { 
    setFormData((current) => ({ ...current, [field]: value })); 
    setErrors((current) => ({ ...current, [field]: undefined })); 
  };  
  
  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const data = await authService.googleLogin(tokenResponse.access_token);
      const { user, token } = extractAuthPayload(data);
      setAuth(user, token);
      toast.success('Đăng nhập Google thành công!', { duration: 3000 });
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập Google thất bại.');
    }
  };

  const loginWithGoogle = useGoogleLogin({ onSuccess: handleGoogleSuccess });

  const handleSubmit = async (event) => {  
    event.preventDefault();  
    setIsLoading(true); 
    setErrors({}); 
  
    try { 
      const data = await authService.login(formData); 
      const { user, token } = extractAuthPayload(data); 
 
      if (!token) { 
        toast.error('Authentication failure: token not provided by server.'); 
        return; 
      } 
 
      setAuth(user, token); 
      toast.success('Login successful! Welcome back to EventHub.', { duration: 3000 }); 
 
      setTimeout(() => { 
        navigate('/'); 
      }, 1500); 
    } catch (error) { 
      if (error.response?.status === 422) { 
        setErrors(error.response.data.errors || {}); 
        toast.error('Validation failed. Please check the fields below.'); 
        return; 
      } 
 
      toast.error(getLoginErrorMessage(error)); 
    } finally { 
      setIsLoading(false); 
    } 
  }; 
 
  return ( 
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-[#2D3748]"> 
      <Toaster position="top-right" /> 
 
      <div className="bg-[#FAF4F4] p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 w-full max-w-[480px]"> 
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
 
        <form onSubmit={handleSubmit} className="space-y-5"> 
          <div className="space-y-1.5"> 
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1" htmlFor="email"> 
              Email Address 
            </label> 
            <div className="relative group"> 
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#800020] w-5 h-5 transition-colors" /> 
              <input 
                id="email" 
                type="email" 
                autoComplete="email" 
                placeholder="name@company.com" 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020] transition-all placeholder:text-gray-300" 
                value={formData.email} 
                onChange={(event) => updateField('email', event.target.value)} 
                required 
              /> 
            </div> 
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium italic">*{errors.email[0]}</p>} 
          </div> 
 
          <div className="space-y-1.5"> 
            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 ml-1" htmlFor="password"> 
              Password 
            </label> 
            <div className="relative group"> 
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#800020] w-5 h-5 transition-colors" /> 
              <input 
                id="password" 
                type="password" 
                autoComplete="current-password" 
                placeholder="Enter your password" 
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#800020]/5 focus:border-[#800020] transition-all placeholder:text-gray-300" 
                value={formData.password} 
                onChange={(event) => updateField('password', event.target.value)} 
                required 
              /> 
            </div> 
            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium italic">*{errors.password[0]}</p>} 
          </div> 
 
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[#800020] text-white py-4 rounded-xl font-bold text-base hover:bg-[#600018] transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-70 mt-6" 
          > 
            {isLoading ? ( 
              <span className="flex items-center gap-2"> 
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

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#FAF4F4] px-3 text-xs text-gray-400 uppercase tracking-widest">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form> 
 
        <div className="mt-10 pt-6 border-t border-gray-200 text-center"> 
          <p className="text-gray-600 text-sm"> 
            Don&apos;t have an account?{' '} 
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