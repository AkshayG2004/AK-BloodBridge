import { useEffect, useState } from "react";
import MyRequestCard from "../../components/Cards/MyRequestCard";
import { getMyRequests } from "../../services/requestService";
import EmptyState from "../../components/Cards/EmptyState";

import type { BloodRequest } from "../../types/bloodRequest";

function MyRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getMyRequests();
      setRequests(res.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xl text-gray-800 dark:text-gray-100">
        Loading...
      </div>
    );

  return (
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

        <div className="grid lg:grid-cols-2 gap-6">

          {requests.map((request) => (
            <MyRequestCard
              key={request._id}
              request={request}
            />
          ))}

        </div>

      )}

    </div>
  );
}

export default MyRequestsPage;