// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./services/auth/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

const qc = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <App />
        {/* 🔔 Global toast container (top-right) */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#0B1220", 
              color: "#FFFFFF",
              border: "1px solid #1F2937", 
            },
            success: {
              iconTheme: { primary: "#3B82F6", secondary: "#FFFFFF" }, // blue-500
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#FFFFFF" }, // red-500
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
