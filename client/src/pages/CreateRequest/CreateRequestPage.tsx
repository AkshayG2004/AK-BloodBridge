import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Droplets,
  Building2,
  MapPin,
  Phone,
  CalendarDays,
  AlertTriangle,
  Boxes,
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
    contactNumber: "",
    urgency: "Medium",
    requiredBefore: "",
  });

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
    <div className="max-w-6xl mx-auto">

      <div className="mb-10">

        <h1 className="text-5xl font-bold">
          Create Blood Request
        </h1>

        <p className="text-gray-500 text-lg mt-2">
          Fill in the patient's details carefully.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-lg p-10"
      >

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left Column */}

          <div className="space-y-6">

            <div>

              <label className="font-semibold mb-2 block">
                Patient Name
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <User
                  className="text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter Patient Name"
                  className="w-full p-4 outline-none"
                  required
                />

              </div>

            </div>

            <div>

              <label className="font-semibold mb-2 block">
                Blood Group
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <Droplets
                  className="text-red-500"
                  size={20}
                />

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full p-4 outline-none bg-transparent"
                  required
                >
                  <option value="">
                    Select Blood Group
                  </option>

                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>

                </select>

              </div>

            </div>

            <div>

              <label className="font-semibold mb-2 block">
                Units Required
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <Boxes
                  className="text-gray-400"
                  size={20}
                />

                <input
                  type="number"
                  min={1}
                  name="unitsRequired"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  className="w-full p-4 outline-none"
                />

              </div>

            </div>

            <div>

              <label className="font-semibold mb-2 block">
                Urgency
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <AlertTriangle
                  className="text-orange-500"
                  size={20}
                />

                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full p-4 outline-none bg-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>

              </div>

            </div>

          </div>

          {/* Right Column */}

          <div className="space-y-6">

            <div>

              <label className="font-semibold mb-2 block">
                Hospital Name
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <Building2
                  className="text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="Apollo Hospital"
                  className="w-full p-4 outline-none"
                  required
                />

              </div>

            </div>

            <div>
              <label className="font-semibold mb-2 block">
                Hospital City
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <MapPin
                  className="text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  name="hospitalCity"
                  value={formData.hospitalCity}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="w-full p-4 outline-none"
                  required
                />

              </div>

            </div>

            <div>

              <label className="font-semibold mb-2 block">
                Hospital Address
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <MapPin
                  className="text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  placeholder="Hospital Address"
                  className="w-full p-4 outline-none"
                  required
                />

              </div>

            </div>

            <div>

              <label className="font-semibold mb-2 block">
                Contact Number
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <Phone
                  className="text-gray-400"
                  size={20}
                />

                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full p-4 outline-none"
                  required
                />

              </div>

            </div>

            <div>

              <label className="font-semibold mb-2 block">
                Required Before
              </label>

              <div className="flex items-center border rounded-xl px-4">

                <CalendarDays
                  className="text-gray-400"
                  size={20}
                />

                <input
                  type="datetime-local"
                  name="requiredBefore"
                  value={formData.requiredBefore}
                  onChange={handleChange}
                  className="w-full p-4 outline-none"
                  required
                />

              </div>

            </div>

          </div>

        </div>

        <div className="mt-10 flex justify-end">

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 transition text-white px-10 py-4 rounded-xl font-semibold text-lg"
          >
            Create Blood Request
          </button>

        </div>

      </form>

    </div>
  );
}

export default CreateRequestPage;