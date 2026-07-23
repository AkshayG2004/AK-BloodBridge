import api from "./api";

export const getRandomFact = async () => {
  const response = await api.get("/facts/random");
  return response.data.fact;
};