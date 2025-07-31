import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../utils/validation.js";
import { toast } from "react-hot-toast";
import { authApi } from "../services/auth/authApi.js";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { name, email, password } = data;
      // 🔐 Send data to backend for email verification (no DB write yet)
      await authApi.register({ name, email, password });

      toast.success("Verification email sent! Please check your inbox.");
      reset();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto space-y-4"
    >
      <Input
        name="name"
        type="text"
        placeholder="Name"
        register={register}
        error={errors.name}
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        register={register}
        error={errors.email}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        register={register}
        error={errors.password}
      />
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        register={register}
        error={errors.confirmPassword}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Sending Verification..." : "Register"}
      </button>
    </form>
  );
}
