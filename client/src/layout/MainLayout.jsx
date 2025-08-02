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
      <nav className="bg-gray-900 text-white px-4 sm:px-6 py-[16px] shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-blue-500 tracking-wide"
          >
            TaskHive
          </Link>

          <div className="w-full sm:w-auto mt-2 sm:mt-0 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            {!isLoggedIn && (onWelcome || isAuthPage) && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium w-full sm:w-auto"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 border border-blue-500 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition text-sm font-medium w-full sm:w-auto"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isLoggedIn && (isAuthPage || onWelcome) && !onDashboard && (
              <Link
                to="/dashboard"
                className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium w-full sm:w-auto"
              >
                Dashboard
              </Link>
            )}

            {isLoggedIn && onDashboard && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium w-full sm:w-auto"
                title="Log out"
              >
                <FiLogOut className="text-white" />
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-64px)] bg-gray-900 text-white">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
