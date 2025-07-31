import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import MainLayout from "./layout/MainLayout";
import Welcome from "./layout/Welcome";
import DashboardLayout from "./pages/DashboardLayout";
import RequireAuth from "./components/RequireAuth";
import VerifyEmail from "./services/auth/Verify";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/verify" element={<VerifyEmail />} />

          <Route path="*" element={<NotFound />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
