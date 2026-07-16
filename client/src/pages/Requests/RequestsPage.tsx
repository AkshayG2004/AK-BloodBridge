import { useEffect, useState } from "react";
import BloodRequestCard from "../../components/Cards/BloodRequestCard";
import {
  getBloodRequests,
  acceptBloodRequest,
} from "../../services/requestService";

interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  urgency: string;
  requiredBefore: string;
  contactNumber: string;
}

function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getBloodRequests();
      setRequests(res.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await acceptBloodRequest(id);

      alert("Blood Request Accepted!");

      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-xl py-20">
        Loading Blood Requests...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Blood Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Help save lives by accepting a request.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Open Blood Requests
          </h2>

          <p className="text-gray-500 mt-3">
            You're all caught up
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {requests.map((request) => (
            <BloodRequestCard
              key={request._id}
              request={request}
              onAccept={handleAccept}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default RequestsPage;