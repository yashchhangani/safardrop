import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Bell,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  X
} from "lucide-react";
import { authService, getStoredUser, userService } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!user;
  const homePath = isLoggedIn ? "/home" : "/login";
  const canCreateTrips = user?.role === "TRAVELLER" || user?.role === "ADMIN";
  const isUserOrTraveller = user?.role === "USER" || user?.role === "TRAVELLER";
  const roleSwitchLabel = user?.role === "USER" ? "Become Traveller" : "Become User";

  const handleLogout = () => {
    authService.logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const handleRoleSwitch = async () => {
    const nextRole = user?.role === "USER" ? "TRAVELLER" : "USER";

    try {
      await userService.switchOwnRole(user.userId, nextRole);
      alert(
        nextRole === "TRAVELLER"
          ? "Your account has been switched to traveller."
          : "Your account has been switched to user."
      );
      setMobileOpen(false);
      navigate(nextRole === "TRAVELLER" ? "/create-trip" : "/home");
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Failed to switch account role");
    }
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
      isActive
        ? "text-blue-700 bg-blue-50"
        : "text-slate-600 hover:text-blue-700 hover:bg-slate-100"
    }`;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={homePath} onClick={closeMobileMenu} className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
            <Package size={20} />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-black text-slate-900">
              Safar<span className="text-blue-600">Drop</span>
            </h1>
            <p className="text-[10px] font-bold uppercase text-slate-400">Community Logistics</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {canCreateTrips && (
            <NavLink to="/notifications" className={navItemClass}>
              <Bell size={16} /> Notifications
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={navItemClass}>
              <LayoutDashboard size={16} /> Admin
            </NavLink>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {isUserOrTraveller && (
                <button
                  onClick={handleRoleSwitch}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  <ArrowLeftRight size={16} />
                  {roleSwitchLabel}
                </button>
              )}

              {canCreateTrips && (
                <NavLink
                  to="/create-trip"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <PlusCircle size={16} />
                  Post Route
                </NavLink>
              )}

              <div className="border-l border-slate-200 pl-3 text-right">
                <p className="max-w-[180px] truncate text-sm font-bold text-slate-900">{user?.userName || user?.email}</p>
                <p className="text-[11px] font-semibold uppercase text-slate-400">{user?.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <LogIn size={16} />
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Signup
              </NavLink>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {canCreateTrips && (
            <NavLink to="/notifications" onClick={closeMobileMenu} className={navItemClass}>
              <Bell size={16} /> Notifications
            </NavLink>
          )}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" onClick={closeMobileMenu} className={navItemClass}>
              <LayoutDashboard size={16} /> Admin
            </NavLink>
          )}

          {isLoggedIn ? (
            <>
              {isUserOrTraveller && (
                <button
                  onClick={handleRoleSwitch}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  <ArrowLeftRight size={16} />
                  {roleSwitchLabel}
                </button>
              )}

              {canCreateTrips && (
                <NavLink
                  to="/create-trip"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive ? "bg-blue-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`
                  }
                >
                  <PlusCircle size={16} />
                  Post Route
                </NavLink>
              )}

              <div className="rounded-lg border border-slate-200 px-3 py-2">
                <p className="truncate text-sm font-bold text-slate-900">{user?.userName || user?.email}</p>
                <p className="text-[11px] font-semibold uppercase text-slate-400">{user?.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <NavLink
                to="/login"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-blue-200 text-blue-700 hover:bg-blue-50"
                  }`
                }
              >
                <LogIn size={16} />
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive ? "bg-slate-800 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
                  }`
                }
              >
                Signup
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
