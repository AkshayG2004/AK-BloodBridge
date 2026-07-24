import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import DonationCard from "../../components/Cards/DonationCard";

import {
  getAcceptedRequests,
} from "../../services/requestService";

import SectionTitle from "../../components/Cards/SectionTitle";
import EmptyState from "../../components/Cards/EmptyState";
import Pagination from "../../components/Pagination/Pagination";

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
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const loadDonations = async () => {
    try {
      setLoading(true);

      const res = await getAcceptedRequests({ page, limit: pageSize });

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
      <div className="text-center py-20 text-gray-800 dark:text-gray-100">
        Loading...
      </div>
    );

  return (
    <>
      <Helmet>
        <title>My Donations | AK BloodBridge</title>
      </Helmet>

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

          <>
            <div className="grid xl:grid-cols-2 gap-8">

              {requests.map((request) => (

                <DonationCard
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

export default DonationsPage;