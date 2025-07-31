import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import axios from "axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("missing");
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/verify", { token });
        console.log(`Response msg: ${res.statusText}`);
        if (!cancelled) {
          setStatus("success");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Verification failed:", err?.response?.data || err);
          setStatus("error");
        }
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  const renderMessage = () => {
    switch (status) {
      case "success":
        return (
          <>
            <FiCheckCircle className="text-green-400 text-3xl mb-2" />
            <p>Email verified successfully! Redirecting to login...</p>
          </>
        );
      case "error":
        return (
          <>
            <FiXCircle className="text-red-400 text-3xl mb-2" />
            <p>Invalid or expired verification link.</p>
          </>
        );
      case "missing":
        return (
          <>
            <FiXCircle className="text-yellow-400 text-3xl mb-2" />
            <p>No verification token found in the URL.</p>
          </>
        );
      default:
        return (
          <>
            <FiLoader className="animate-spin text-blue-400 text-3xl mb-2" />
            <p>Verifying your email, please wait...</p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-800 p-8 rounded shadow text-center max-w-md">
        <h1 className="text-xl font-semibold mb-4">Email Verification</h1>
        {renderMessage()}
      </div>
    </div>
  );
};

export default VerifyEmail;
