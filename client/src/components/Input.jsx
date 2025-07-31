import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = ({ type = "text", name, register, error, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="relative mb-4">
      <input
        type={inputType}
        placeholder={placeholder}
        {...(register && register(name))}
        className="w-full px-4 py-2.5 bg-gray-800 text-white border border-gray-600 rounded-md 
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isPasswordType && (
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
        >
          {showPassword ? <FiEye /> : <FiEyeOff />}
        </span>
      )}

      {error && <p className="text-sm text-red-400 mt-1">{error.message}</p>}
    </div>
  );
};

export default Input;
