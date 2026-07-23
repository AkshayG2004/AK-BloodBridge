import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface SendOTPData {
  name: string;
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  otp: string;
}

// ==========================
// Login
// ==========================
export const loginUser = async (data: LoginData) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

// ==========================
// Forgot Password - Send OTP
// ==========================
export const forgotPassword = async (email: string) => {
  const response = await api.post(
    "/users/forgot-password",
    { email }
  );

  return response.data;
};

export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const response = await api.post(
    "/users/reset-password",
    data
  );

  return response.data;
};

// ==========================
// Send Registration OTP
// ==========================
export const sendRegistrationOTP = async (
  data: SendOTPData
) => {
  const response = await api.post(
    "/users/send-otp",
    data
  );

  return response.data;
};

// ==========================
// Verify OTP & Register
// ==========================
export const registerUser = async (
  data: RegisterData
) => {
  const response = await api.post(
    "/users/register",
    data
  );

  return response.data;
};

// ==========================
// Get My Profile
// ==========================
export const getMyProfile = async (
  token: string
) => {
  const response = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};