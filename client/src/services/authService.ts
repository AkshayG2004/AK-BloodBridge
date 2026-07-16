import api from "./api";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/users/login", data);
  return response.data;
};

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/users/register", data);
  return response.data;
};

export const getMyProfile = async (token: string) => {
  const response = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};