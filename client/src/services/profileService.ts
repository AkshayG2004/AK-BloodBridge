import axios from "axios";

const API = "http://localhost:5000/api/profile";

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateProfile = async (data: any) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    API,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};