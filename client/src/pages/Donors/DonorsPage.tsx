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

  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [availability, setAvailability] = useState("");

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

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {

      const matchesName =
        donor.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesBlood =
        bloodGroup === "" ||
        donor.bloodGroup === bloodGroup;

      const matchesAvailability =
        availability === "" ||
        donor.availabilityStatus === availability;

      return (
        matchesName &&
        matchesBlood &&
        matchesAvailability
      );
    });
  }, [donors, search, bloodGroup, availability]);

  return (
    <div>

      <SectionTitle
        title="Available Donors"
        subtitle="Search and connect with eligible blood donors."
      />

      {/* Filters */}

      <div className="bg-white rounded-3xl shadow-md p-6 mb-8">

        <div className="grid lg:grid-cols-3 gap-5">

          <input
            type="text"
            placeholder="Search donor..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
          />

          <select
            value={bloodGroup}
            onChange={(e) =>
              setBloodGroup(e.target.value)
            }
            className="border rounded-xl px-4 py-3 outline-none"
          >
            <option value="">All Blood Groups</option>

            <option>O+</option>
            <option>O-</option>

            <option>A+</option>
            <option>A-</option>

            <option>B+</option>
            <option>B-</option>

            <option>AB+</option>
            <option>AB-</option>

          </select>

          <select
            value={availability}
            onChange={(e) =>
              setAvailability(e.target.value)
            }
            className="border rounded-xl px-4 py-3 outline-none"
          >
            <option value="">All Availability</option>

            <option>Available</option>
            <option>Busy</option>
            <option>Unavailable</option>

          </select>

        </div>

      </div>

      {/* Loading */}

      {loading ? (

        <div className="text-center py-20 text-gray-500 text-xl">
          Loading donors...
        </div>

      ) : filteredDonors.length === 0 ? (

        <EmptyState
          title="No donors found"
          subtitle="Try changing the search or filter."
        />

      ) : (

        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6">

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