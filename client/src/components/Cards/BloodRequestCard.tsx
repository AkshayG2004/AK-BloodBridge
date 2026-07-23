import {
  MapPin,
  CalendarDays,
  Phone,
  Hospital,
  User,
  FileText,
} from "lucide-react";

import UrgencyBadge from "./UrgencyBadge";
import type { BloodRequest } from "../../types/bloodRequest";
import { formatDateTime } from "../../utils/date";

interface Props {
  request: BloodRequest;
  onAccept: (id: string) => void;
}

function BloodRequestCard({
  request,
  onAccept,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 border border-gray-200 dark:border-gray-800 flex flex-col h-full">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>

          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Patient
          </p>

          <h2 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
            {request.patientName}
          </h2>

          <div className="flex items-center gap-4 mt-5">

            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-4 py-2">

            <div>
              <p className="text-[11px] uppercase tracking-wide text-red-500 dark:text-red-400">
                Blood Group
              </p>

              <p className="font-semibold text-red-700 dark:text-red-300">
                {request.bloodGroup}
              </p>
            </div>

          </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2">

            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Units
              </p>

              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {request.unitsRequired}
              </p>
            </div>

          </div>

          </div>
        </div>

        <UrgencyBadge urgency={request.urgency} />

      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

      {/* Details */}
      <div className="space-y-5 flex-1">

        <div className="flex items-start gap-3">
          <Hospital size={18} className="text-gray-500 dark:text-gray-400 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Hospital
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-100">
              {request.hospitalName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-gray-500 dark:text-gray-400 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Location
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-100">
              {request.hospitalCity}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {request.hospitalAddress}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User size={18} className="text-gray-500 dark:text-gray-400 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Contact Person
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-100">
              {request.contactPerson}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone size={18} className="text-gray-500 dark:text-gray-400 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Contact Number
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-100">
              {request.contactNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays size={18} className="text-gray-500 dark:text-gray-400 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Required Before
            </p>

            <p className="font-medium text-gray-900 dark:text-gray-100">
              {formatDateTime(request.requiredBefore)}
            </p>
          </div>
        </div>

        {request.notes?.trim() && (
          <div className="flex items-start gap-3">
            <FileText size={18} className="text-gray-500 dark:text-gray-400 mt-0.5" />

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Notes
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-300">
                {request.notes}
              </p>
            </div>
          </div>
        )}

        {request.acceptedDonors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Accepted Donors
            </h3>

            <div className="space-y-3">
              {request.acceptedDonors.map((donor) => (
                <div
                  key={donor.donor._id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4"
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {donor.donor.name}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {donor.donor.bloodBridgeId}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {donor.donor.phone}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {donor.donor.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">

        <div className="text-sm">

          <p className="font-medium text-gray-800 dark:text-gray-200">
            Requested by{" "}
            <span className="text-red-600 dark:text-red-400">
              {request.requester?.bloodBridgeId}
            </span>
          </p>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {request.createdAt
              ? formatDateTime(request.createdAt)
              : ""}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Accepted Donors:{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {request.acceptedCount}/{request.unitsRequired}
            </span>
          </p>

        </div>

        <button
          disabled={request.acceptedCount >= request.unitsRequired}
          onClick={() => onAccept(request._id)}
          className={`h-11 px-6 rounded-xl text-white font-semibold transition ${
            request.acceptedCount >= request.unitsRequired
              ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {request.acceptedCount >= request.unitsRequired
            ? "Request Full"
            : "Accept Request"}
        </button>

      </div>

    </div>
  );
}

export default BloodRequestCard;