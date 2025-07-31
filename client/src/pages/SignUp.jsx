import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 px-4">
      <div className="relative w-full max-w-md p-8 rounded-xl shadow-lg bg-gradient-to-br from-gray-850 to-gray-900">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            Create an Account
          </h2>

          <RegisterForm />

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-500 underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
