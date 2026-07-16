import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const getAllRequests = async () => {
  const res = await api.get("/admin/requests");
  return res.data;
};

export const deleteRequest = async (id: string) => {
  const res = await api.delete(`/admin/requests/${id}`);
  return res.data;
};

export const updateRequestStatus = async (
  id: string,
  status: string
) => {
  const res = await api.patch(
    `/admin/requests/${id}/status`,
    { status }
  );

  return res.data;
};