import { useForm } from "react-hook-form";
import Input from "./Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../utils/validation";
import { authApi } from "../services/auth/authApi";
import { useAuth } from "../services/auth/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from a protected page, go back there after login
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (values) => {
    try {
      const res = await authApi.login(values); // { token, user }
      login({ token: res.data.token, user: res.data.user }); // stores in context + localStorage
      toast.success("Welcome back!");
      reset();
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto space-y-4"
    >
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
