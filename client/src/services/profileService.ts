import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await api.put("/profile", data);
  return res.data;
};