import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import MyRequestCard from "../../components/Cards/MyRequestCard";
import { getMyRequests } from "../../services/requestService";
import EmptyState from "../../components/Cards/EmptyState";
import Pagination from "../../components/Pagination/Pagination";

import type { BloodRequest } from "../../types/bloodRequest";

function MyRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const res = await getMyRequests({ page, limit: pageSize });

      setRequests(res.requests);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && requests.length === 0)
    return (
      <div className="text-center py-20 text-xl text-gray-800 dark:text-gray-100">
        Loading...
      </div>
    );

  return (
    <>
      <Helmet>
        <title>My Requests | AK BloodBridge</title>
      </Helmet>

      <div>

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            My Requests
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track every blood request you've created.
          </p>

        </div>

        {requests.length === 0 ? (

          <EmptyState
            title="No Requests Yet"
            subtitle="Create a blood request whenever you need help."
          />

        ) : (

          <>
            <div className="grid lg:grid-cols-2 gap-6">

              {requests.map((request) => (
                <MyRequestCard
                  key={request._id}
                  request={request}
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

export default MyRequestsPage;