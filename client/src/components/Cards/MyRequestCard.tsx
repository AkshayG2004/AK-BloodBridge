import { useState } from "react";

import {
  Hospital,
  MapPin,
  Droplets,
  User,
  Phone,
  Package,
  Clock3,
  CalendarDays,
  X,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import {
  formatDate,
  formatDateTime,
} from "../../utils/date";

import {
  confirmDonation,
  rejectDonation,
} from "../../services/requestService";
import toast from "react-hot-toast";

interface Request {
  _id: string;

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalCity: string;
  hospitalAddress: string;

  contactPerson: string;
  contactNumber: string;

  requiredBefore: string;
  notes?: string;

  status: string;

  requester?: {
    bloodBridgeId: string;
  };

  acceptedCount: number;

  acceptedDonors: {
    donor: {
      _id: string;
      bloodBridgeId: string;
      name: string;
      phone: string;
      city: string;
    };

    status:
      | "Accepted"
      | "Completed"
      | "Rejected";

    confirmedAt?: string;
  }[];

  createdAt: string;
}

interface Props {
  request: Request;
}

function MyRequestCard({ request }: Props) {

  const [showDonors, setShowDonors] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(request);
  const displayRequest = currentRequest;
  const handleConfirm = async (donorId: string) => {
    try {
      await confirmDonation(displayRequest._id, donorId);

      const updatedDonors = displayRequest.acceptedDonors.map((d) =>
        d.donor._id === donorId
          ? {
              ...d,
              status: "Completed" as const,
            }
          : d
      );

      const hasPending = updatedDonors.some(
        (d) => d.status === "Accepted"
      );

      setCurrentRequest({
        ...displayRequest,
        acceptedDonors: updatedDonors,
        status: hasPending ? displayRequest.status : "Completed",
      });

      toast.success("Donation confirmed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Unable to confirm donation");
    }
  };

  const handleReject = async (donorId: string) => {
  try {
    await rejectDonation(displayRequest._id, donorId);

    const updatedDonors = displayRequest.acceptedDonors.map((d) =>
      d.donor._id === donorId
        ? {
            ...d,
            status: "Rejected" as const,
          }
        : d
    );

    const hasPending = updatedDonors.some(
      (d) => d.status === "Accepted"
    );

    setCurrentRequest({
      ...displayRequest,
      acceptedDonors: updatedDonors,
      status: hasPending ? displayRequest.status : "Completed",
    });

    toast.success("Donation rejected successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Unable to reject donation");
  }
};

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {displayRequest.patientName}
            </h2>

            <div className="flex items-center gap-3 mt-4">

              <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-semibold text-sm">
                <Droplets size={16} />
                {displayRequest.bloodGroup}
              </div>

              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-semibold text-sm">
                <Package size={16} />
                {displayRequest.unitsRequired} Units
              </div>

            </div>

          </div>

          <StatusBadge status={displayRequest.status} />

        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

        {/* Hospital Details */}
        <div className="space-y-5 flex-1">

          <div className="flex justify-between gap-8">

            <div className="flex items-start gap-3 flex-1">
              <Hospital size={18} className="mt-0.5 text-gray-500 dark:text-gray-400" />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Hospital
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {displayRequest.hospitalName}
                </p>
              </div>

            </div>

            <div className="flex items-start gap-3 flex-1">
              <MapPin size={18} className="mt-0.5 text-gray-500 dark:text-gray-400" />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Location
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {displayRequest.hospitalCity}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {displayRequest.hospitalAddress}
                </p>

              </div>

            </div>

          </div>

          <div className="flex justify-between gap-8">

            <div className="flex items-start gap-3 flex-1">
              <User size={18} className="mt-0.5 text-gray-500 dark:text-gray-400" />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Contact Person
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {displayRequest.contactPerson}
                </p>

              </div>

            </div>

            <div className="flex items-start gap-3 flex-1">
              <Phone size={18} className="mt-0.5 text-gray-500 dark:text-gray-400" />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Contact Number
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {displayRequest.contactNumber}
                </p>

              </div>

            </div>

          </div>

          <div className="flex justify-between gap-8">

            <div className="flex items-start gap-3 flex-1">
              <CalendarDays size={18} className="mt-0.5 text-gray-500 dark:text-gray-400" />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Created On
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDateTime(displayRequest.createdAt)}
                </p>

              </div>

            </div>

            <div className="flex items-start gap-3 flex-1">
              <Clock3 size={18} className="mt-0.5 text-gray-500 dark:text-gray-400" />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Required Before
                </p>

                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(displayRequest.requiredBefore)}
                </p>

              </div>

            </div>

          </div>

        </div>

        {displayRequest.notes && (

          <div className="mt-5">

            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Notes
            </p>

            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
              {displayRequest.notes}
            </div>

          </div>

        )}

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">

          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Accepted Donors
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {displayRequest.acceptedDonors.length} of {displayRequest.unitsRequired} donors accepted this request.
          </p>

          {displayRequest.acceptedDonors.length > 0 && (

            <button
              onClick={() => setShowDonors(true)}
              className="mt-4 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              View Donors
            </button>

          )}

        </div>

      </div>

      {/* Modal */}

      {showDonors && (

        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center">

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-[550px] max-h-[80vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Accepted Donors
              </h2>

              <button
                onClick={() => setShowDonors(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
              >
                <X size={24}/>
              </button>

            </div>

            <div className="space-y-4">

              {displayRequest.acceptedDonors.map((donor) => (

                <div
                  key={donor.donor._id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 p-5"
                >

                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {donor.donor.name}
                  </p>

                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    BloodBridge ID : {donor.donor.bloodBridgeId}
                  </p>

                  <p className="text-gray-600 dark:text-gray-400">
                    Phone : {donor.donor.phone}
                  </p>

                  <p className="mt-2 font-medium text-gray-900 dark:text-gray-100">
                    Status : {donor.status}
                  </p>

                  {donor.status === "Accepted" && (
                    <div className="mt-3 flex gap-3">

                      <button
                        onClick={() => handleConfirm(donor.donor._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Confirm Donation
                      </button>

                      <button
                        onClick={() => handleReject(donor.donor._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Reject Donation
                      </button>

                    </div>
                  )}

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default MyRequestCard;