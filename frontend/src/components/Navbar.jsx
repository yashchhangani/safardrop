// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, PlusCircle, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      
      {/* Logo & Branding */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
          <Package size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
            Safar<span className="text-blue-600">Drop</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">
            Instant Community Logistics
          </p>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 font-semibold text-gray-600">
        <Link to="/" className="hover:text-blue-600 transition-colors">Find Routes</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/my-trips" className="flex items-center gap-2 hover:text-blue-600 transition-colors text-sm">
              <MapPin size={18} /> My Routes
            </Link>

            {/* My Bookings link */}
            <Link to="/my-bookings" className="flex items-center gap-2 hover:text-blue-600 transition-colors text-sm">
              <MapPin size={18} /> My Bookings
            </Link>

            <Link
              to="/create-trip"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200 text-sm"
            >
              <PlusCircle size={18} /> Post Route
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors ml-4"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="flex items-center gap-2 text-blue-600 border-2 border-blue-600 px-5 py-2 rounded-full hover:bg-blue-50 transition-all text-sm">
              <LogIn size={18} /> Login
            </Link>
            <Link to="/signup" className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-200 transition-all text-sm">
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;