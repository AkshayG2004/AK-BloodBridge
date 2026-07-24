import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

interface GetUsersParams {
  page: number;
  limit: number;
  bloodGroup?: string;
  availabilityStatus?: string;
  city?: string;
}

export const getAllUsers = async (params: GetUsersParams) => {
  const res = await api.get("/admin/users", { params });
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

interface GetRequestsParams {
  page: number;
  limit: number;
}

export const getAllRequests = async (params: GetRequestsParams) => {
  const res = await api.get("/admin/requests", { params });
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