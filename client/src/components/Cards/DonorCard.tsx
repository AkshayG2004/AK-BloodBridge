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
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-800 p-6 flex flex-col h-full">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <User size={22} />
            {donor.name}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">

            <BadgeCheck
              size={16}
              className="text-blue-600 dark:text-blue-400"
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

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

      {/* Body */}

      <div className="space-y-4 flex-1 text-gray-700 dark:text-gray-300">

        <div className="flex items-center gap-3">

          <Droplets
            size={18}
            className="text-red-600 dark:text-red-400"
          />

          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {donor.bloodGroup}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Heart
            size={18}
            className="text-pink-600 dark:text-pink-400"
          />

          <span>
            {donor.totalDonations} Donations
          </span>

        </div>

        <div className="flex items-center gap-3">

          <CalendarDays
            size={18}
            className="text-gray-500 dark:text-gray-400"
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
            className="text-gray-500 dark:text-gray-400"
          />

          <span>
            {donor.city || "Not Updated"}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Phone
            size={18}
            className="text-gray-500 dark:text-gray-400"
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