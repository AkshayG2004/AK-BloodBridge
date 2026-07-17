import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "react-hot-toast";

import { getProfile, updateProfile } from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    bloodBridgeId: "",
    name: "",
    email: "",
    bloodGroup: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    weight: "",
    city: "",
    availabilityStatus: "Available",
    totalDonations: 0,

    lastDonationDate: "",
    nextEligibleDonationDate: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await getProfile();
      const user = res.user;

      setForm({
        bloodBridgeId: user.bloodBridgeId || "",
        name: user.name || "",
        email: user.email || "",
        bloodGroup: user.bloodGroup || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.substring(0, 10)
          : "",
        weight: user.weight || "",
        city: user.city || "",
        availabilityStatus:
          user.availabilityStatus || "Available",
        totalDonations: user.totalDonations || 0,

        lastDonationDate: user.lastDonationDate || "",
        nextEligibleDonationDate:
          user.nextEligibleDonationDate || "",
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await updateProfile({
        bloodGroup: form.bloodGroup,
        phone: form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        weight: Number(form.weight),
        city: form.city,
        availabilityStatus: form.availabilityStatus,
      });

      refreshUser(res.user);

      toast.success("Profile updated successfully");

      if (res.user.isProfileComplete) {
        navigate(
          res.user.role === "admin"
            ? "/admin/dashboard"
            : "/dashboard",
          { replace: true }
        );
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your personal information.
        </p>
      </div>
      { !form.bloodGroup ||
        !form.phone ||
        !form.gender ||
        !form.dateOfBirth ||
        !form.weight ||
        !form.city ? (
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5">
            <h2 className="text-yellow-800 font-semibold text-lg">
              Complete Your Profile
            </h2>

            <p className="text-yellow-700 mt-2">
              Please complete your profile to unlock all features of
              <span className="font-semibold"> AK BloodBridge</span>.
              This helps us to verify donor information and ensure a safe,
              reliable experience for everyone.
            </p>
          </div>
        ) : null}

      <div className="bg-white rounded-2xl shadow p-8">

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="BloodBridge ID"
            value={form.bloodBridgeId}
            disabled
          />

          <Input
            label="Name"
            value={form.name}
            disabled
          />

          <Input
            label="Email"
            value={form.email}
            disabled
          />

          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Blood Group
            </p>

            <div className="relative">

              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                <option value="">Select Blood Group</option>
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
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
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

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <Input
            label="Weight (kg)"
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
          />

          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange}
          />

          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Gender
            </p>

            <div className="relative">

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:border-red-500"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
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

          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
              Availability
            </p>

            {form.availabilityStatus === "Unavailable" ? (
              <>
                <div className="w-full h-11 flex items-center rounded-xl border border-gray-300 bg-gray-100 px-4 text-sm text-gray-600">
                  Unavailable (Donation Recovery Period)
                </div>

                <p className="text-xs text-red-600 mt-2">
                  You recently donated blood. You'll automatically become available again
                  after your recovery period.
                </p>
              </>
            ) : (
              <>
                <div className="relative">
                  <select
                    name="availabilityStatus"
                    value={form.availabilityStatus}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 pr-10 text-sm appearance-none focus:outline-none focus:border-red-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">
                      Busy (Temporarily unable to donate)
                    </option>
                  </select>

                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
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

                <p className="text-xs text-gray-500 mt-2">
                  Donation eligibility is managed automatically after each successful
                  donation. Use <strong>Busy</strong> only if you're temporarily unable
                  to donate due to illness, injury, or personal reasons.
                </p>
              </>
            )}
          </div>

          <Input
            label="Total Donations"
            value={String(form.totalDonations)}
            disabled
          />

          <Input
            label="Last Donation Date"
            value={
              form.lastDonationDate
                ? new Date(form.lastDonationDate).toLocaleDateString()
                : "No donations yet"
            }
            disabled
          />

          <Input
            label="Next Eligible Donation"
            value={
              form.nextEligibleDonationDate
                ? new Date(
                    form.nextEligibleDonationDate
                  ).toLocaleDateString()
                : "Eligible Now"
            }
            disabled
          />

        </div>

        <div className="mt-8 flex justify-end">

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition disabled:opacity-60"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </div>

    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  name?: string;
  type?: string;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

function Input({
  label,
  value,
  name,
  type = "text",
  disabled = false,
  onChange,
}: InputProps) {
  return (
    <div>

      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`w-full h-11 rounded-xl border border-gray-300 px-4 text-sm ${
          disabled
            ? "bg-gray-100 text-gray-500"
            : "focus:ring-2 focus:ring-red-500 outline-none"
        }`}
      />

    </div>
  );
}

export default ProfilePage;