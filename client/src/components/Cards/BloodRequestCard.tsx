import {
  MapPin,
  CalendarDays,
  Phone,
  Droplets,
  Hospital,
  User,
  FileText,
  Package,
} from "lucide-react";

import UrgencyBadge from "./UrgencyBadge";
import type { BloodRequest } from "../../types/bloodRequest";

interface Props {
  request: BloodRequest;
  onAccept: (id: string) => void;
}

function BloodRequestCard({
  request,
  onAccept,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-200 border border-gray-100 p-7 flex flex-col h-full">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Patient
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {request.patientName}
          </h2>

          <div className="flex gap-8 mt-5">

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Blood Group
              </p>

              <div className="flex items-center gap-2 mt-1 text-red-600 font-semibold">
                <Droplets size={18} />
                {request.bloodGroup}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Units
              </p>

              <div className="flex items-center gap-2 mt-1 font-semibold">
                <Package size={18} />
                {request.unitsRequired}
              </div>
            </div>

          </div>
        </div>

        <UrgencyBadge urgency={request.urgency} />

      </div>

      {/* Divider */}
      <div className="border-t my-6" />

      {/* Details */}
      <div className="space-y-5 flex-1">

        <div className="flex items-start gap-3">
          <Hospital size={18} className="text-gray-500 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Hospital
            </p>

            <p className="font-medium">
              {request.hospitalName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-gray-500 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Location
            </p>

            <p className="font-medium">
              {request.hospitalCity}
            </p>

            <p className="text-sm text-gray-500">
              {request.hospitalAddress}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User size={18} className="text-gray-500 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Contact Person
            </p>

            <p className="font-medium">
              {request.contactPerson}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone size={18} className="text-gray-500 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Contact Number
            </p>

            <p className="font-medium">
              {request.contactNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays size={18} className="text-gray-500 mt-0.5" />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Required Before
            </p>

            <p className="font-medium">
              {new Date(request.requiredBefore).toLocaleString()}
            </p>
          </div>
        </div>

        {request.notes?.trim() && (
          <div className="flex items-start gap-3">
            <FileText size={18} className="text-gray-500 mt-0.5" />

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Notes
              </p>

              <p className="text-sm text-gray-700">
                {request.notes}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}

      <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">

        <div className="text-sm">

          <p className="font-medium text-gray-800">
            Requested by{" "}
            <span className="text-red-600">
              {request.requester?.bloodBridgeId}
            </span>
          </p>

          <p className="text-gray-500 mt-1">
            {request.createdAt
              ? new Date(request.createdAt).toLocaleString()
              : ""}
          </p>

        </div>

        <button
          onClick={() => onAccept(request._id)}
          className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
        >
          Accept Request
        </button>

      </div>

    </div>
  );
}

export default BloodRequestCard;