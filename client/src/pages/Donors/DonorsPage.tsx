import { useEffect, useMemo, useState } from "react";

import DonorCard from "../../components/Cards/DonorCard";
import EmptyState from "../../components/Cards/EmptyState";
import SectionTitle from "../../components/Cards/SectionTitle";

import { getDonors } from "../../services/donorService";

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

function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  const [bloodGroup, setBloodGroup] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      setLoading(true);

      const res = await getDonors();

      setDonors(res.donors);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    "All",
    ...Array.from(
      new Set(
        donors
          .map((donor) => donor.city)
          .filter(Boolean)
      )
    ).sort(),
  ];

 const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const matchesBlood =
      bloodGroup === "All" ||
      donor.bloodGroup === bloodGroup;

      const matchesCity =
        cityFilter === "All" ||
        donor.city === cityFilter;

      return matchesBlood && matchesCity;
    });
  }, [donors, bloodGroup, cityFilter]);

  return (
    <div>

      <div className="flex items-end justify-between mb-5">

        {/* Left */}

        <SectionTitle
          title="Available Donors"
          subtitle="Search and connect with eligible blood donors."
        />

        {/* Right */}

        <div className="flex items-end gap-2">

        {/* Blood Group */}

        <div>

          <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Blood
          </p>

          <div className="relative w-24">

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
            >

              <option value="All">All</option>

              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>

            </select>

            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>

          </div>

        </div>

        {/* City */}

        <div>

          <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            City
          </p>

          <div className="relative w-36">

            <select
              value={cityFilter}
              onChange={(e) =>
                setCityFilter(e.target.value)
              }
              className="w-full h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 pr-9 text-sm appearance-none focus:outline-none focus:border-red-500"
            >

              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))}

            </select>

            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>

          </div>

        </div>

        {/* Count */}

        <div className="h-9 px-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2">

          <span className="text-xs text-gray-500 dark:text-gray-400">
            Donors
          </span>

          <span className="font-bold text-red-600 dark:text-red-400">
            {filteredDonors.length}
          </span>

        </div>

        {/* Reset */}

        {(bloodGroup !== "All" || cityFilter !== "All") && (

          <button
            onClick={() => {
              setBloodGroup("All");
              setCityFilter("All");
            }}
            className="h-9 px-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm hover:bg-red-100 dark:hover:bg-red-900 transition"
          >
            Reset
          </button>

        )}

      </div>

    </div>

      {/* Loading */}

      {loading ? (

        <div className="text-center py-20 text-gray-500 dark:text-gray-400 text-xl">
          Loading donors...
        </div>

      ) : filteredDonors.length === 0 ? (

        <EmptyState
          title="No donors found"
          subtitle="Try changing the search or filter."
        />

      ) : (

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6 mt-1">

          {filteredDonors.map((donor) => (

            <DonorCard
              key={donor._id}
              donor={donor}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default DonorsPage;