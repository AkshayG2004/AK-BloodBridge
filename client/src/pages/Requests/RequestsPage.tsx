import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BloodRequestCard from "../../components/Cards/BloodRequestCard";
import {
  getBloodRequests,
  acceptBloodRequest,
} from "../../services/requestService";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination/Pagination";

import type { BloodRequest } from "../../types/bloodRequest";

function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await getBloodRequests({ page, limit: pageSize });

      setRequests(res.requests);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await acceptBloodRequest(id);

      toast.success("Blood request accepted successfully.");

      await fetchRequests();
    } catch (err: any) {
      toast.error(
          err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-800 dark:text-gray-100">
          Loading blood requests...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Requests | AK BloodBridge</title>
      </Helmet>

      <div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Blood Requests
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Help save lives by accepting a request.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-10 text-center">
            <h2 className="text-2xl font-bold">
              No Blood Requests Available
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-3">
              There are currently no active blood requests near you.
              Please check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              {requests.map((request) => (
                <BloodRequestCard
                  key={request._id}
                  request={request}
                  onAccept={handleAccept}
                />
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow mt-6">
              <Pagination
                currentPage={page}
                totalItems={total}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                bordered={false}
              />
            </div>
          </>
        )}

      </div>
    </>
  );
}

export default RequestsPage;