import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  sendRegistrationOTP,
  registerUser,
} from "../../services/authService";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

// Save your image at: client/src/assets/images/auth-bg1.png
import authBg from "../../assets/images/auth-bg1.png";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await sendRegistrationOTP({
        name,
        email,
        password,
      });

      toast.success("OTP sent to your email.");

      setShowOTPModal(true);

    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      await registerUser({
        email,
        otp,
      });

      toast.success("Registration Successful!");

      setShowOTPModal(false);

      navigate("/");

    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        "Invalid OTP"
      );
    } finally {
      setLoading(false);
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
            Join a network
            <br />
            <span className="text-red-600">that saves lives.</span>
          </h2>
          <p className="text-[15px] text-gray-400 max-w-md">
            Register as a donor today and become part of a community
            <br/>
            ready to respond when it matters most.
          </p>
        </div>

        {/* Right auth card */}
        <div className="flex-1 flex items-center justify-end px-5 py-24 lg:py-0 lg:pr-44">

          <form
            onSubmit={handleRegister}
            className="w-full max-w-sm bg-neutral-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10"
          >

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Create account
            </h1>
            <p className="text-sm text-gray-400 mb-2">
              Fill in your details to get started.
            </p>
            <div className="w-10 h-1 bg-red-600 rounded-full mb-8" />

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative mb-5">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative mb-6">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-red-900/30 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>

            <p className="text-center mt-6 text-sm text-gray-400">

              Already have an account?{" "}

              <Link
                to="/"
                className="text-white font-semibold hover:text-red-500 transition"
              >
                Sign in
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

    {showOTPModal && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-sm max-h-[90vh] overflow-y-auto">

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Verify your email
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-gray-200">{email}</span>
          </p>

          <input
            type="text"
            placeholder="000000"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 text-center tracking-[6px] sm:tracking-[10px] text-xl sm:text-2xl font-semibold text-white mb-6 focus:outline-none focus:border-red-600 transition"
          />

          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            onClick={() => {
              setOtp("");
              setShowOTPModal(false);
            }}
            className="w-full mt-3 text-sm text-gray-400 hover:text-red-500 transition"
          >
            Cancel
          </button>

        </div>
      </div>
    )}

    </>
  );
}

export default RegisterPage;