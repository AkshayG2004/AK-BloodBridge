import { useEffect, useState } from "react";

import DonationCard from "../../components/Cards/DonationCard";

import {
  getAcceptedRequests,
  completeDonation,
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

  const handleComplete = async (id: string) => {
    try {
      await completeDonation(id);

      alert("Donation Completed Successfully");

      loadDonations();

    } catch (err: any) {

      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );

    }
  };

  if (loading)
    return (
      <div className="text-center py-20">
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
              onComplete={handleComplete}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default DonationsPage;