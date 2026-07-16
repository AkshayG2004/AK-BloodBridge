import {
  User,
  Droplets,
  Phone,
  MapPin,
  CalendarDays,
  Heart,
  BadgeCheck,
} from "lucide-react";

import AvailabilityBadge from "./AvailabilityBadge";

interface Donor {
  _id: string;
  bloodBridgeId: string;
  name: string;
  bloodGroup: string;
  phone?: string;
  city?: string;
  availabilityStatus: string;
  totalDonations: number;
  nextEligibleDonationDate?: string;
}

interface Props {
  donor: Donor;
}

function DonorCard({ donor }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 flex flex-col h-full">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User size={22} />
            {donor.name}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-gray-500">

            <BadgeCheck
              size={16}
              className="text-blue-600"
            />

            <span className="text-sm">
              {donor.bloodBridgeId}
            </span>

          </div>

        </div>

        <AvailabilityBadge
          availability={donor.availabilityStatus}
        />

      </div>

      {/* Body */}

      <div className="mt-8 space-y-4 flex-1 text-gray-700">

        <div className="flex items-center gap-3">

          <Droplets
            size={18}
            className="text-red-600"
          />

          <span className="font-semibold">
            {donor.bloodGroup}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Heart
            size={18}
            className="text-pink-600"
          />

          <span>
            {donor.totalDonations} Donations
          </span>

        </div>

        <div className="flex items-center gap-3">

          <CalendarDays
            size={18}
            className="text-gray-500"
          />

          <span>
           {donor.nextEligibleDonationDate
            ? new Date(
                donor.nextEligibleDonationDate
            ).toLocaleDateString()
            : "Eligible Now"}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <MapPin
            size={18}
            className="text-gray-500"
          />

          <span>
            {donor.city || "Not Updated"}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Phone
            size={18}
            className="text-gray-500"
          />

          <span>
            {donor.phone || "Not Available"}
          </span>

        </div>

      </div>

    </div>
  );
}

export default DonorCard;