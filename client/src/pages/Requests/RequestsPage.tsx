import { useEffect, useState } from "react";
import BloodRequestCard from "../../components/Cards/BloodRequestCard";
import {
  getBloodRequests,
  acceptBloodRequest,
} from "../../services/requestService";
import toast from "react-hot-toast";

interface BloodRequest {
  _id: string;

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalCity: string;
  hospitalAddress: string;

  contactPerson: string;
  contactNumber: string;

  urgency: string;
  requiredBefore: string;
  notes?: string;

  status: string;

  requester?: {
    _id: string;
    bloodBridgeId: string;
    name: string;
    phone: string;
    city: string;
  };

  acceptedBy?: {
    _id: string;
    bloodBridgeId: string;
    name: string;
    phone: string;
    city: string;
  };

  createdAt?: string;
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

      toast.success("Blood request accepted successfully.");

      await fetchRequests();
    } catch (err: any) {
      toast.error(
          err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
          Loading blood requests...
      </div>
    );
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Blood Requests
        </h1>

        <p className="text-gray-500 mt-1">
          Help save lives by accepting a request.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Blood Requests Available
          </h2>

          <p className="text-gray-500 mt-3">
            There are currently no active blood requests near you.
            Please check back later.
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