import api from "./api";

export const getDonors = async (
  bloodGroup?: string
) => {
  const res = await api.get("/users/donors", {
    params: {
      bloodGroup,
    },
  });

  return res.data;
};