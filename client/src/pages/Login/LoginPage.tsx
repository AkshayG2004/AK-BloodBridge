import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../services/authService";

import toast from "react-hot-toast";

function LoginPage() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);

  const [resetEmail, setResetEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [loadingReset, setLoadingReset] = useState(false);

  const handleSendOTP = async () => {
    try {
      setLoadingReset(true);

      await forgotPassword(resetEmail);

      toast.success("OTP sent successfully");

      setOtpSent(true);

    } catch (err: any) {

      toast.error(
        err.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {
      setLoadingReset(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoadingReset(true);

      await resetPassword({
        email: resetEmail,
        otp,
        newPassword,
      });

      toast.success("Password reset successfully");

      setShowForgotModal(false);

      setOtpSent(false);

      setResetEmail("");

      setOtp("");

      setNewPassword("");

    } catch (err: any) {

      toast.error(
        err.response?.data?.message ||
        "Password reset failed"
      );

    } finally {
      setLoadingReset(false);
    }
  };

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const res = await loginUser({
        email,
        password,
      });

      login(
        res.token,
        res.user
      );

      toast.success("Login Successful");

      if (res.user.role === "admin") {

        navigate(
          "/admin/dashboard",
          { replace: true }
        );

        return;
      }

      if (!res.user.isProfileComplete) {

        navigate(
          "/profile",
          { replace: true }
        );

        return;
      }

      navigate(
        "/dashboard",
        { replace: true }
      );

    } catch (err: any) {

      toast.error(
        err.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (
    <>

    <div className="min-h-screen flex">

      {/* ===== Left Brand Panel ===== */}
      <div className="hidden lg:flex w-1/2 bg-red-600 flex-col justify-between p-12 text-white">

        <div className="text-3xl font-bold tracking-tight">
          BloodBridge
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Together, we bridge donors 
            <br />
            and those in need.
          </h2>
          <p className="text-red-100 max-w-md">
            Sign in to manage your donations, track requests, and stay
            connected with donors and recipients near you.
          </p>
        </div>

        <div className="text-sm text-red-200">
          &copy; {new Date().getFullYear()} BloodBridge. All rights reserved.
        </div>

      </div>

      {/* ===== Right Form Panel ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">

        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm"
        >

          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Sign in
          </h1>
          <p className="text-gray-500 mb-8">
            Enter your credentials to access your account.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter you Email ID"
            className="w-full border-b-2 border-gray-200 py-2.5 mb-6 text-sm focus:outline-none focus:border-red-600 transition"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div className="relative mb-2">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full border-b-2 border-gray-200 py-2.5 pr-16 text-sm focus:outline-none focus:border-red-600 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wide text-gray-400 hover:text-red-600 transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <div className="flex justify-end mb-8">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-red-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-red-600 transition"
          >
            Login
          </button>

          <p className="text-center mt-8 text-sm text-gray-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-gray-900 font-semibold hover:text-red-600 transition"
            >
              Create one
            </Link>

          </p>

        </form>

      </div>

    </div>

    {showForgotModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-xl">

      <h2 className="text-2xl font-bold mb-2">
        Forgot Password
      </h2>

      <p className="text-gray-500 text-sm mb-6">
        {!otpSent
          ? "Enter your registered email to receive an OTP."
          : "Enter the OTP and your new password."}
      </p>

      {!otpSent ? (
        <>

          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter your email"
          />

          <button
            onClick={handleSendOTP}
            disabled={loadingReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
          >
            {loadingReset ? "Sending..." : "Send OTP"}
          </button>

        </>
      ) : (
        <>

          <label className="block text-sm font-medium mb-2">
            OTP
          </label>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter OTP"
          />

          <label className="block text-sm font-medium mb-2">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter new password"
          />

          <button
            onClick={handleResetPassword}
            disabled={loadingReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
          >
            {loadingReset
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </>
      )}

      <button
        onClick={() => {
          setShowForgotModal(false);
          setOtpSent(false);
          setResetEmail("");
          setOtp("");
          setNewPassword("");
        }}
        className="mt-4 w-full text-gray-500 hover:text-red-600 transition"
      >
        Cancel
      </button>

    </div>

  </div>
)}
</>

  );

}

export default LoginPage;