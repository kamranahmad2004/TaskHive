import { Link } from "react-router-dom";
import { useAuth } from "../services/auth/AuthContext.jsx";

const Welcome = () => {
  // If you don't have AuthContext, you can fallback to:
  // const stored = localStorage.getItem("user");
  // const user = stored ? JSON.parse(stored) : null;

  const { user } = useAuth() || {};
  const displayName =
    user?.name ||
    user?.fullName ||
    (user?.email ? user.email.split("@")[0] : null);

  const isLoggedIn = Boolean(user);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 flex items-center justify-center px-4 py-20">
      <div className="relative w-full max-w-2xl text-center p-10 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 pointer-events-none" />

        {/* Main content */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {isLoggedIn ? (
              <>
                Welcome back,{" "}
                <span className="text-blue-500 drop-shadow-md">
                  {displayName}
                </span>
              </>
            ) : (
              <>
                Welcome to{" "}
                <span className="text-blue-500 drop-shadow-md">TaskHive</span>
              </>
            )}
          </h1>

          <p className="md:text-lg text-[15px] text-gray-400">
            Organize, prioritize, and manage your daily tasks with clarity and
            focus.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition shadow"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition shadow"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 border border-blue-500 text-blue-400 font-medium rounded-md hover:bg-blue-500 hover:text-white transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
