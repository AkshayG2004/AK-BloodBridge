import api from "./api";

// ==========================
// Create Blood Request
// ==========================
export const createBloodRequest = async (data: any) => {
  const res = await api.post("/requests", data);
  return res.data;
};

// ==========================
// Get All Open Blood Requests
// ==========================
export const getBloodRequests = async () => {
  const res = await api.get("/requests");
  return res.data;
};

// ==========================
// Accept Blood Request
// ==========================
export const acceptBloodRequest = async (id: string) => {
  const res = await api.put(`/requests/${id}/accept`);
  return res.data;
};

// ==========================
// Get My Blood Requests
// ==========================
export const getMyRequests = async () => {
  const res = await api.get("/requests/my");
  return res.data;
};

// ==========================
// Get My Accepted Donations
// ==========================
export const getAcceptedRequests = async () => {
  const res = await api.get("/requests/accepted");
  return res.data;
};

// ==========================
// Complete Donation
// ==========================
export const completeDonation = async (id: string) => {
  const res = await api.put(`/requests/${id}/complete`);
  return res.data;
};