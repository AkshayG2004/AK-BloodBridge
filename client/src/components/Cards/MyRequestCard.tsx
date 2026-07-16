import {
  CalendarDays,
  Hospital,
  MapPin,
  Droplets,
  User,
  Phone,
  BadgeCheck,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

interface Request {
  _id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  requiredBefore: string;
  status: string;
  acceptedBy?: {
    bloodBridgeId: string;
    name: string;
    phone: string;
  };
}

interface Props {
  request: Request;
}

function MyRequestCard({ request }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between min-h-[430px]">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-3xl font-bold">
            {request.patientName}
          </h2>

          <div className="mt-3 inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full font-semibold">
            <Droplets size={16} />
            {request.bloodGroup}
          </div>
        </div>

        <StatusBadge status={request.status} />

      </div>

      {/* Hospital Details */}
      <div className="mt-8 space-y-4 text-gray-600">

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

      </div>

      {/* Footer */}
      <div className="mt-8 border-t pt-5 h-40 flex flex-col">

        <div className="flex justify-between items-center mb-5">

          <div>
            <p className="text-gray-500 text-sm">
              Units Required
            </p>

            <p className="text-2xl font-bold">
              {request.unitsRequired}
            </p>
          </div>

        </div>

        {/* Open Request */}
        {request.status === "Open" && (
        <div>
            <h3 className="font-semibold text-gray-700">
            Waiting for a donor...
            </h3>

            <p className="text-gray-500 mt-2 text-sm">
            Nearby eligible donors can view and accept this request.
            </p>
        </div>
        )}

        {/* Accepted / Completed */}
        {(request.status === "Accepted" ||
        request.status === "Completed") &&
        request.acceptedBy && (
            <div>

            <h3 className="font-semibold text-gray-700 mb-4">
                Donor Details
            </h3>

            <div className="space-y-3 text-gray-600">

                <div className="flex items-center gap-3">
                <User size={18} />
                {request.acceptedBy.name}
                </div>

                <div className="flex items-center gap-3">
                <BadgeCheck size={18} />
                {request.acceptedBy.bloodBridgeId}
                </div>

                <div className="flex items-center gap-3">
                <Phone size={18} />
                {request.acceptedBy.phone}
                </div>

            </div>

            </div>
        )}

      </div>

    </div>
  );
}

export default MyRequestCard;