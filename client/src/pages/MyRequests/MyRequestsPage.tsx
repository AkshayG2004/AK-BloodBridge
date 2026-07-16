import { useEffect, useState } from "react";
import MyRequestCard from "../../components/Cards/MyRequestCard";
import { getMyRequests } from "../../services/requestService";

interface Request {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  requiredBefore: string;
  status: string;
  acceptedBy?: {
    bloodBridgeId: string;
    name: string;
    phone: string;
  };
}

function MyRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
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
      <div className="text-center py-20 text-xl">
        Loading...
      </div>
    );

  return (
    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          My Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Track every blood request you've created.
        </p>

      </div>

      {requests.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col h-full">

          <h2 className="text-2xl font-bold">
            No Requests Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Create a blood request whenever you need help.
          </p>

        </div>

      ) : (

        <div className="grid xl:grid-cols-2 gap-8 items-stretch">

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