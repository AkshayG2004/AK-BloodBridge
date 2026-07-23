import { useState } from "react";

import {
  CalendarDays,
  Hospital,
  MapPin,
  Droplets,
  CheckCircle,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import { useAuth } from "../../context/AuthContext";

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

interface Props {
  request: Request;
}

function DonationCard({ request }: Props) {
  const { user } = useAuth();

  const [currentRequest] = useState(request);
  const displayRequest = currentRequest;

  const myDonation = displayRequest.acceptedDonors?.find(
    (d) => d.donor._id === user?._id
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full">

      <div>

        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {displayRequest.patientName}
            </h2>

            <div className="mt-3 inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-semibold text-sm">
              <Droplets size={16} />
              {displayRequest.bloodGroup}
            </div>

          </div>

          <StatusBadge status={displayRequest.status} />

        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

        <div className="space-y-4 text-gray-600 dark:text-gray-400">

          <div className="flex items-center gap-3">
            <Hospital size={18} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100">
              {displayRequest.hospitalName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-gray-500 dark:text-gray-400" />
            {displayRequest.hospitalAddress}
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-gray-500 dark:text-gray-400" />
            {new Date(
              displayRequest.requiredBefore
            ).toLocaleDateString()}
          </div>

        </div>

      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Units Required
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {displayRequest.unitsRequired}
            </h2>

          </div>

          {myDonation?.status === "Accepted" && (
            <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
              Awaiting Requester's Confirmation
            </div>
          )}

          {myDonation?.status === "Completed" && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
              <CheckCircle size={22} />
              Donation Completed
            </div>
          )}

          {myDonation?.status === "Rejected" && (
            <div className="font-semibold text-red-600 dark:text-red-400">
              Donation Rejected
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default DonationCard;