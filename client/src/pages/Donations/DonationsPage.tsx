import { useEffect, useState } from "react";

import DonationCard from "../../components/Cards/DonationCard";

import {
  getAcceptedRequests,
} from "../../services/requestService";

import SectionTitle from "../../components/Cards/SectionTitle";
import EmptyState from "../../components/Cards/EmptyState";

interface Request {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  requiredBefore: string;
  status: string;

  acceptedDonors: {
    donor: {
      _id: string;
    };
    status: "Accepted" | "Completed" | "Rejected";
  }[];
}

function DonationsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const res = await getAcceptedRequests();
      setRequests(res.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-800 dark:text-gray-100">
        Loading...
      </div>
    );

  return (
    <div>

      <SectionTitle
        title="My Donations"
        subtitle="Blood requests you've accepted."
      />

      {requests.length === 0 ? (

        <EmptyState
          title="No Donations Yet"
          subtitle="Accept a blood request to start saving lives."
        />

      ) : (

        <div className="grid xl:grid-cols-2 gap-8">

          {requests.map((request) => (

            <DonationCard
              key={request._id}
              request={request}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default DonationsPage;