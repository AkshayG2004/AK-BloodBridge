import {
  MapPin,
  CalendarDays,
  Phone,
  Droplets,
  Hospital,
} from "lucide-react";

import UrgencyBadge from "./UrgencyBadge";

interface BloodRequest {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  urgency: "Low" | "Medium" | "High" | "Critical";
  requiredBefore: string;
  contactNumber?: string;
}

interface Props {
  request: BloodRequest;
  onAccept: (id: string) => void;
}

function BloodRequestCard({
  request,
  onAccept,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 flex flex-col h-full">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-3xl font-bold">
            {request.patientName}
          </h2>

          <div className="flex items-center gap-2 mt-2 text-red-600 font-semibold">
            <Droplets size={18} />
            {request.bloodGroup}
          </div>

        </div>

        <UrgencyBadge urgency={request.urgency} />

      </div>

      {/* Details */}
      <div className="mt-8 space-y-4 text-gray-600 flex-1">

        <div className="flex items-center gap-3">
          <Hospital size={18} />
          <span>{request.hospitalName}</span>
        </div>

        <div className="flex items-center gap-3">
          <MapPin size={18} />
          <span>{request.hospitalAddress}</span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={18} />
          <span>
            Needed Before{" "}
            <strong>
              {new Date(request.requiredBefore).toLocaleDateString()}
            </strong>
          </span>
        </div>

        {request.contactNumber && (
          <div className="flex items-center gap-3">
            <Phone size={18} />
            <span>{request.contactNumber}</span>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-auto border-t pt-5 flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            Units Required
          </p>

          <h3 className="text-3xl font-bold">
            {request.unitsRequired}
          </h3>

        </div>

        <button
          onClick={() => onAccept(request._id)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Accept Request
        </button>

      </div>

    </div>
  );
}

export default BloodRequestCard;