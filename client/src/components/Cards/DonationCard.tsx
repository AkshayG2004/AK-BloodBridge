import {
  CalendarDays,
  Hospital,
  MapPin,
  Droplets,
  CheckCircle,
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
}

interface Props {
  request: Request;
  onComplete: (id: string) => void;
}

function DonationCard({
  request,
  onComplete,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between">

      <div>

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

        <div className="mt-8 space-y-4 text-gray-600">

          <div className="flex items-center gap-3">
            <Hospital size={18} />
            {request.hospitalName}
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={18} />
            {request.hospitalAddress}
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays size={18} />
            {new Date(
              request.requiredBefore
            ).toLocaleDateString()}
          </div>

        </div>

      </div>

      <div className="mt-8 border-t pt-5">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500 text-sm">
              Units Required
            </p>

            <h2 className="text-2xl font-bold">
              {request.unitsRequired}
            </h2>

          </div>

          {request.status === "Accepted" ? (

            <button
              onClick={() => onComplete(request._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Complete Donation
            </button>

          ) : (

            <div className="flex items-center gap-2 text-green-600 font-semibold">

              <CheckCircle size={22} />

              Donation Completed

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default DonationCard;