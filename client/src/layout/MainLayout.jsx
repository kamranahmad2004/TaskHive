import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth/AuthContext.jsx";
import { FiLogOut } from "react-icons/fi";

const MainLayout = () => {
  const { user, logout } = useAuth() || {};
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(user);
  const onWelcome = pathname === "/";
  const onDashboard = pathname === "/dashboard";
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const handleLogout = () => {
    if (!window.confirm("Are you sure to logout?")) return;
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-500 tracking-wide"
          >
            TaskNest
          </Link>

          {/* Not logged in → show on Welcome and Auth pages */}
          {!isLoggedIn && (onWelcome || isAuthPage) && (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 border border-blue-500 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Logged in → show Dashboard/Profile on welcome or auth pages */}
          {isLoggedIn && (isAuthPage || onWelcome) && !onDashboard && (
            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
              >
                Dashboard
              </Link>
            </div>
          )}

          {/* Logged in & on dashboard → show Logout only */}
          {isLoggedIn && onDashboard && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
                title="Log out"
              >
                <FiLogOut className="text-white" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="min-h-[calc(100vh-64px)] bg-gray-900 text-white">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
