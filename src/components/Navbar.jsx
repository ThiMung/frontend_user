import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { authStore } from '../store/authStore';

const Navbar = () => {
  const { user, logout } = authStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `pb-0.5 text-[15px] font-medium transition-colors ${
      isActive
        ? 'text-[#8B2635] border-b-2 border-[#8B2635]'
        : 'text-gray-500 hover:text-[#8B2635]'
    }`;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Calendar className="w-6 h-6 text-[#8B2635]" strokeWidth={2.2} />
          <span className="text-2xl font-serif font-bold text-[#8B2635] tracking-tight">
            EventHub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/" end className={navLinkClass}>
            Browse Events
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            My Dashboard
          </NavLink>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-500">
                Hi, {user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#F5A623] text-white hover:bg-[#e09510] transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
