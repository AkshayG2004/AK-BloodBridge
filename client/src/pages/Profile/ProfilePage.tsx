import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

import { getProfile, updateProfile } from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const [dob, setDob] = useState<Date | null>(null);
  const today = new Date();

  const maxDOB = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const minDOB = new Date(
    today.getFullYear() - 65,
    today.getMonth(),
    today.getDate()
  );

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
        weight: user.weight ?? "",
        city: user.city || "",
        availabilityStatus:
          user.availabilityStatus || "Available",
        totalDonations: user.totalDonations || 0,

        lastDonationDate: user.lastDonationDate || "",
        nextEligibleDonationDate:
          user.nextEligibleDonationDate || "",
      });

      setDob(
        user.dateOfBirth
          ? new Date(user.dateOfBirth)
          : null
      );

    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

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
      <div className="flex justify-center items-center h-[60vh] text-lg text-gray-800 dark:text-gray-100">
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile | AK BloodBridge</title>
      </Helmet>

      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal information.
          </p>
        </div>
        { !form.bloodGroup ||
          !form.phone ||
          !form.gender ||
          !form.dateOfBirth ||
          !form.weight ||
          !form.city ? (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-900 rounded-2xl p-5">
              <h2 className="text-yellow-800 dark:text-yellow-300 font-semibold text-lg">
                Complete Your Profile
              </h2>

              <p className="text-yellow-700 dark:text-yellow-400 mt-2">
                Please complete your profile to unlock all features of
                <span className="font-semibold"> AK BloodBridge</span>.
                This helps us to verify donor information and ensure a safe,
                reliable experience for everyone.
              </p>
            </div>
          ) : null}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8">

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Please make sure every detail below is entered correctly and carefully.
          </p>

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
              <label className="block text-sm font-medium mb-2">
                Blood Group
              </label>

              <div className="relative">

                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 pr-10 text-sm appearance-none focus:outline-none focus:border-red-500"
                >
                  <option className="dark:bg-gray-800 dark:text-gray-200" value="">Select Blood Group</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">A+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">A-</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">B+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">B-</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">AB+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">AB-</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">O+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">O-</option>
                </select>

                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
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
              <label className="block text-sm font-medium mb-2">
                Date of Birth
              </label>

              <DatePicker
              wrapperClassName="w-full"
                selected={dob}
                onChange={(date: Date | null) => {
                  setDob(date);

                  setForm((prev) => ({
                    ...prev,
                    dateOfBirth: date
                      ? date.toISOString().split("T")[0]
                      : "",
                  }));
                }}

                dateFormat="dd MMM yyyy"

                placeholderText="Select Date of Birth"

                showMonthDropdown
                showYearDropdown
                dropdownMode="select"

                minDate={minDOB}
                maxDate={maxDOB}

                className="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm outline-none focus:border-red-500"

                calendarClassName="rounded-xl shadow-lg border"
                popperPlacement="bottom-start"
              />

            </div>

            <Input
              label="Phone"
              name="phone"
              value={form.phone}
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
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Gender
              </label>

              <div className="relative">

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 pr-10 text-sm appearance-none focus:outline-none focus:border-red-500"
                >
                  <option className="dark:bg-gray-800 dark:text-gray-200" value="">Select Gender</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">Male</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">Female</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">Other</option>
                </select>

                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
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
              <label className="block text-sm font-medium mb-2">
                Availability
              </label>

              {form.availabilityStatus === "Unavailable" ? (
                <>
                  <div className="w-full h-11 flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 text-sm text-gray-600 dark:text-gray-300">
                    Unavailable (Donation Recovery Period)
                  </div>

                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
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
                      className="w-full h-11 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 pr-10 text-sm appearance-none focus:outline-none focus:border-red-500"
                    >
                      <option className="dark:bg-gray-800 dark:text-gray-200" value="Available">Available</option>
                      <option className="dark:bg-gray-800 dark:text-gray-200" value="Busy">
                        Busy (Temporarily unable to donate)
                      </option>
                    </select>

                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
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

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
                  ? formatDate(form.lastDonationDate)
                  : "No donations yet"
              }
              disabled
            />

            <Input
              label="Next Eligible Donation"
              value={
                form.nextEligibleDonationDate
                  ? formatDate(form.nextEligibleDonationDate)
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
    </>
  );
}

interface InputProps {
  label: string;
  value: string;
  name?: string;
  type?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
        readOnly={disabled}
        onChange={onChange ?? (() => {})}
        className={`w-full h-11 rounded-xl border px-4 text-sm ${
          disabled
            ? "border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            : "border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-red-500 outline-none"
        }`}
      />

    </div>
  );
}

export default ProfilePage;