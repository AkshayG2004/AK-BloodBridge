import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registerUser({
        name,
        email,
        password,
      });

      toast.success("Registration Successful!");

      navigate("/");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          AK BloodBridge Register
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border rounded p-3 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-3 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-3 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
        >
          Register
        </button>

        <p className="text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-red-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default RegisterPage;