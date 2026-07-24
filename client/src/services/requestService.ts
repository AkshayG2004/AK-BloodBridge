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
interface PageParams {
  page: number;
  limit: number;
}

export const getBloodRequests = async (params: PageParams) => {
  const res = await api.get("/requests", { params });
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
export const getMyRequests = async (params: PageParams) => {
  const res = await api.get("/requests/my", { params });
  return res.data;
};

// ==========================
// Get My Accepted Donations
// ==========================
export const getAcceptedRequests = async (params: PageParams) => {
  const res = await api.get("/requests/accepted", { params });
  return res.data;
};

// ==========================
// Complete Donation
// ==========================
export const completeDonation = async (id: string) => {
  const res = await api.put(`/requests/${id}/complete`);
  return res.data;
};

// ==========================
// Confirm Donation (Requester)
// ==========================
export const confirmDonation = async (
  requestId: string,
  donorId: string
) => {
  const res = await api.patch(
    `/requests/${requestId}/confirm/${donorId}`
  );

  return res.data;
};

// ==========================
// Reject Donation (Requester)
// ==========================
export const rejectDonation = async (
  requestId: string,
  donorId: string
) => {
  const res = await api.patch(
    `/requests/${requestId}/reject/${donorId}`
  );

  return res.data;
};