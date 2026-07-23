import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  User,
  Droplets,
  Building2,
  MapPin,
  Phone,
  CalendarDays,
  AlertTriangle,
  Boxes,
  FileText,
} from "lucide-react";

import { createBloodRequest } from "../../services/requestService";
import toast from "react-hot-toast";

function CreateRequestPage() {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  patientName: "",
  bloodGroup: "",
  unitsRequired: 1,

  hospitalName: "",
  hospitalCity: "",
  hospitalAddress: "",

  contactPerson: "",
  contactNumber: "",

  urgency: "",
  requiredBefore: "",

  notes: "",
});

const [requiredDate, setRequiredDate] = useState<Date | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await createBloodRequest(formData);

      toast.success("Blood Request Created Successfully!");

      navigate("/my-requests");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="w-full">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Create Blood Request
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Fill in the patient's information to notify nearby eligible donors.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6"
      >

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">

          {/* Left Column */}

          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
              Patient Information
            </h2>

            <div>

              <label className="block text-sm font-medium mb-2">
                Patient Name
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <User
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter Patient Name"
                  className="w-full px-3 text-sm outline-none bg-transparent"
                  required
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Blood Group
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <Droplets
                  className="text-red-500"
                  size={18}
                />

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full h-full px-3 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none appearance-none"
                  required
                >
                  <option className="dark:bg-gray-800 dark:text-gray-200" value="">
                    Select Blood Group
                  </option>

                  <option className="dark:bg-gray-800 dark:text-gray-200">A+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">A-</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">B+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">B-</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">AB+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">AB-</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">O+</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200">O-</option>
                </select>

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Units Required
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <Boxes
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />

                <input
                  type="number"
                  min={1}
                  max={10}
                  step={1}
                  name="unitsRequired"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  className="w-full px-3 text-sm outline-none bg-transparent"
                  required
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Urgency
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <AlertTriangle
                  className="text-orange-500"
                  size={18}
                />

                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full h-full px-3 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none appearance-none"
                  required
                >
                  <option className="dark:bg-gray-800 dark:text-gray-200" value="">
                    Select Urgency
                  </option>

                  <option className="dark:bg-gray-800 dark:text-gray-200" value="Low">Low</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200" value="Medium">Medium</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200" value="High">High</option>
                  <option className="dark:bg-gray-800 dark:text-gray-200" value="Critical">Critical</option>
                </select>

              </div>

            </div>

             <div>

              <label className="block text-sm font-medium mb-2">
                Contact Person
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <User
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Enter Contact Person"
                  className="w-full px-3 text-sm outline-none bg-transparent"
                  required
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Contact Number
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <Phone
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-3 text-sm outline-none bg-transparent"
                  required
                />

              </div>

            </div>

          </div>

          {/* Right Column */}

          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
              Hospital Information
            </h2>

            <div>

              <label className="block text-sm font-medium mb-2">
                Hospital Name
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <Building2
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="Apollo Hospital"
                  className="w-full px-3 text-sm outline-none bg-transparent"
                  required
                />

              </div>

            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Hospital City
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <MapPin
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  name="hospitalCity"
                  value={formData.hospitalCity}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="w-full px-3 text-sm outline-none bg-transparent"
                  required
                />

              </div>

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Hospital Address
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <MapPin
                  className="text-gray-400 dark:text-gray-500"
                  size={18}
                />

                <input
                  type="text"
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  placeholder="Hospital Address"
                  className="w-full px-3 text-sm outline-none bg-transparent"
                  required
                />

              </div>

            </div>

           

            <div>
              <label className="block text-sm font-medium mb-2">
                Required Before
              </label>

              <div className="flex items-center h-11 border border-gray-300 dark:border-gray-700 rounded-xl px-4">

                <CalendarDays
                  className="text-gray-400 dark:text-gray-500 shrink-0"
                  size={18}
                />

                <DatePicker
                  selected={requiredDate}
                  onChange={(date: Date | null) => {
                    setRequiredDate(date);

                    setFormData((prev) => ({
                      ...prev,
                      requiredBefore: date
                        ? date.toISOString()
                        : "",
                    }));
                  }}
                  showTimeSelect
                  timeIntervals={30}
                  dateFormat="dd MMM yyyy, hh:mm aa"
                  minDate={new Date()}
                  placeholderText="Select date & time"

                  className="w-full px-3 bg-transparent outline-none text-sm"

                  calendarClassName="rounded-xl shadow-lg border"
                  popperPlacement="bottom-start"
                  required
                />

              </div>
            </div>
            <div>

              <label className="block text-sm font-medium mb-2">
                Additional Notes
              </label>

              <div className="flex items-start border border-gray-300 dark:border-gray-700 rounded-xl px-4 min-h-[136px]">

                <FileText
                  className="text-gray-400 dark:text-gray-500 mt-4"
                  size={18}
                />

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Optional information for donors..."
                  className="w-full p-4 outline-none resize-none bg-transparent"
                />

              </div>

            </div>

          </div>

        </div>

        <div className="mt-10 flex justify-end">

          <button
            type="submit"
            className="h-11 px-8 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-semibold"
          >
            Create Blood Request
          </button>

        </div>

      </form>

    </div>
  );
}

export default CreateRequestPage;