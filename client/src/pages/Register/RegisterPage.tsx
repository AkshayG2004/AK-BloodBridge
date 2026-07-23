import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  sendRegistrationOTP,
  registerUser,
} from "../../services/authService";
import toast from "react-hot-toast";

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
    <div className="min-h-screen flex">

      {/* ===== Left Brand Panel ===== */}
      <div className="hidden lg:flex w-1/2 bg-red-600 flex-col justify-between p-12 text-white">

        <div className="text-3xl font-bold tracking-tight">
          BloodBridge
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Join a network
            <br />
            that saves lives.
          </h2>
          <p className="text-red-100 max-w-md">
            Register as a donor today and become part of a community
            ready to respond when it matters most.
          </p>
        </div>

        <div className="text-sm text-red-200">
          &copy; {new Date().getFullYear()} BloodBridge. All rights reserved.
        </div>

      </div>

      {/* ===== Right Form Panel ===== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">

        <form
          onSubmit={handleRegister}
          className="w-full max-w-sm"
        >

          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Create account
          </h1>
          <p className="text-gray-500 mb-8">
            Fill in your details to get started.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full border-b-2 border-gray-200 py-2.5 mb-6 text-sm focus:outline-none focus:border-red-600 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email ID"
            className="w-full border-b-2 border-gray-200 py-2.5 mb-6 text-sm focus:outline-none focus:border-red-600 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex items-center justify-between mb-1 leading-none">
            <label className="text-sm font-medium text-gray-700 leading-none">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 hover:text-red-600 transition leading-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full border-b-2 border-gray-200 py-2.5 mb-8 text-sm focus:outline-none focus:border-red-600 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>

          <p className="text-center mt-8 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-gray-900 font-semibold hover:text-red-600 transition"
            >
              Sign in
            </Link>
          </p>

        </form>

      </div>

      {showOTPModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify your email
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-gray-800">{email}</span>
            </p>

            <input
              type="text"
              placeholder="000000"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border-b-2 border-gray-200 py-3 text-center tracking-[10px] text-2xl font-semibold mb-6 focus:outline-none focus:border-red-600 transition"
            />

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={() => {
                setOtp("");
                setShowOTPModal(false);
              }}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-900 transition"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default RegisterPage;