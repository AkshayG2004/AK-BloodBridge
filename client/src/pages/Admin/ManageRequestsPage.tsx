import { useEffect, useState } from "react";

import {
  getAllRequests,
  deleteRequest,
} from "../../services/adminService";
import RequestDetailsModal from "../../components/Modals/RequestDetailsModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SectionTitle from "../../components/Cards/SectionTitle";
import Pagination from "../../components/Pagination/Pagination";

interface Request {
  _id: string;

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalCity: string;
  hospitalAddress: string;

  contactNumber: string;

  urgency: string;
  status: string;

  requiredBefore: string;

  requester?: {
    bloodBridgeId: string;
    name: string;
  };
}

function ManageRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const res = await getAllRequests({ page, limit: pageSize });

      setRequests(res.requests);
      setTotal(res.total);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {

  const result = await Swal.fire({
    title: "Delete Request?",
    text: "This blood request will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });

  if (!result.isConfirmed) return;

  try {

    await deleteRequest(id);

    toast.success("Request deleted successfully.");

    loadRequests();

  } catch (err: any) {

    toast.error(
      err.response?.data?.message ||
      "Failed to delete request."
    );

  }

};

  if (loading && requests.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-800 dark:text-gray-100">
        Loading requests...
      </div>
    );
  }

  return (
    <div>

      <SectionTitle
        title="Manage Blood Requests"
        subtitle="View, inspect and manage all blood requests."
      />

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-red-600 text-white">

            <tr>

              <th className="p-4 text-left">
                Requester
              </th>

              <th className="p-4 text-left">
                Blood Group
              </th>

              <th className="p-4 text-left">
                Hospital
              </th>

              <th className="p-4 text-left">
                City
              </th>

              <th className="p-4 text-left">
                Urgency
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {requests.length === 0 ? (

              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-gray-500 dark:text-gray-400"
                >
                  No requests found.
                </td>
              </tr>

            ) : (

              requests.map((request) => (

              <tr
                key={request._id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >

                <td className="p-4 text-gray-800 dark:text-gray-200">
                  {request.requester?.name}
                </td>

                <td className="p-4 text-gray-800 dark:text-gray-200">
                  {request.bloodGroup}
                </td>

                <td className="p-4 text-gray-800 dark:text-gray-200">
                  {request.hospitalName}
                </td>

                <td className="p-4 text-gray-800 dark:text-gray-200">
                  {request.hospitalCity}
                </td>

                <td className="p-4 text-gray-800 dark:text-gray-200">
                  {request.urgency}
                </td>

                <td className="p-4 text-gray-800 dark:text-gray-200">
                  {request.status}
                </td>

                <td className="p-4 text-center space-x-2">

                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(request._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </td>

              </tr>

              ))

            )}

          </tbody>

        </table>

        <Pagination
          currentPage={page}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />

       </div>

      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUpdated={loadRequests}
      />

    </div>
  );
}

export default ManageRequestsPage;