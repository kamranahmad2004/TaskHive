import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden px-4">
      <div className="bg-gray-950 shadow-2xl rounded-2xl p-10 md:p-16 text-center max-w-lg w-full z-10 border border-gray-800">
        <h1 className="text-[8rem] md:text-[10rem] font-extrabold text-red-500 mb-4 leading-none">
          404
        </h1>
        <p className="text-2xl font-semibold text-white mb-2">Page Not Found</p>
        <p className="text-gray-400 mb-6">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-teal-500 hover:bg-teal-400 text-white font-medium text-lg py-2 px-6 rounded-full transition duration-300 shadow-md"
        >
          Go Back Home
        </Link>
      </div>

      {/* Animated Background Bubbles */}
      <div className="absolute bottom-10 flex gap-6 animate-pulse">
        <div
          className="w-5 h-5 bg-red-500 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-5 h-5 bg-red-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-5 h-5 bg-red-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>

      {/* Decorative floating icons */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-teal-600 rounded-full opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-16 right-16 w-32 h-32 bg-red-600 rounded-full opacity-20 animate-[float_8s_ease-in-out_infinite]"></div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
