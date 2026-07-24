import api from "./api";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (
  payload: ContactPayload
) => {
  const res = await api.post("/contact", payload);
  return res.data;
};