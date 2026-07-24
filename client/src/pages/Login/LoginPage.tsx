import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../services/authService";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import toast from "react-hot-toast";

// Save your image at: client/src/assets/images/auth-bg1.png
import authBg from "../../assets/images/auth-bg1.png";

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

  const [showNewPassword, setShowNewPassword] = useState(false);

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

      setShowNewPassword(false);

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

    <div className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* ===== Background Image ===== */}
      <img
        src={authBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/25" />

      {/* ===== Logo ===== */}
      <div className="absolute top-8 left-6 sm:top-10 lg:left-16 z-20 flex items-center gap-2">
 
        <span className="text-3xl sm:text-4xl font-bold tracking-tight">
          <span className="text-red-600">Blood</span>
          <span className="text-white">Bridge</span>
        </span>
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row lg:items-center">

        {/* Left hero text (desktop only) */}
        <div className="hidden lg:flex flex-col justify-center flex-1 pl-16 pr-28 max-w-2xl -translate-y-36">
          <h2 className="text-4xl font-semibold leading-tight text-white mb-5">
            Together, we bridge donors
            <br />
            <span className="text-red-600">and those in need.</span>
          </h2>
          <p className="text-[15px] text-gray-400 max-w-md">
            Sign in to manage your donations, track requests, and stay
            connected with donors and recipients near you.
          </p>
        </div>

        {/* Right auth card */}
        <div className="flex-1 flex items-center justify-end px-5 py-24 lg:py-0 lg:pr-44">

          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm bg-neutral-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10"
          >

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Sign in
            </h1>
            <p className="text-sm text-gray-400 mb-2">
              Enter your credentials to access your account.
            </p>
            <div className="w-10 h-1 bg-red-600 rounded-full mb-8" />

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative mb-5">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type="email"
                placeholder="Enter your Email ID"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>

            <div className="relative mb-3">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-red-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-red-900/30"
            >
              Login
            </button>

            <p className="text-center mt-6 text-sm text-gray-400">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-white font-semibold hover:text-red-500 transition"
              >
                Create one
              </Link>

            </p>

          </form>

        </div>

      </div>

      {/* ===== Footer ===== */}
      <div className="absolute bottom-10 left-0 right-0 z-20 px-6 text-xs text-white text-center sm:left-16 sm:right-auto sm:w-auto sm:text-left">
        &copy; {new Date().getFullYear()} BloodBridge. All rights reserved.
      </div>

    </div>

    {showForgotModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
        Forgot Password
      </h2>

      <p className="text-gray-400 text-sm mb-6">
        {!otpSent
          ? "Enter your registered email to receive an OTP."
          : "Enter the OTP and your new password."}
      </p>

      {!otpSent ? (
        <>

          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>

          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
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

          <label className="block text-sm font-medium text-gray-300 mb-2">
            OTP
          </label>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter OTP"
          />

          <label className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>

          <div className="relative mb-6">

            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Enter new password"
            />

            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

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
          setShowNewPassword(false);
        }}
        className="mt-4 w-full text-gray-400 hover:text-red-500 transition"
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