import { useState } from 'react'; 
import { ArrowRight, Calendar, Lock, Mail } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import toast, { Toaster } from 'react-hot-toast'; 
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