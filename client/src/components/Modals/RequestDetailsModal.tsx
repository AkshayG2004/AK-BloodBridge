import { useState, useEffect } from "react";
import { updateRequestStatus } from "../../services/adminService";
import toast from "react-hot-toast";

interface Request {
  _id: string;

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalCity: string;
  hospitalAddress: string;

  contactNumber: string;

  urgency: string;
  status: string;

  requiredBefore: string;

  requester?: {
    bloodBridgeId: string;
    name: string;
  };
}

interface Props {
  request: Request | null;
  onClose: () => void;
  onUpdated: () => void;
}

function RequestDetailsModal({
  request,
  onClose,
  onUpdated,
}: Props) {
    if (!request) {
    return null;
  }
  const [status, setStatus] = useState(request.status);

useEffect(() => {
  setStatus(request.status);
}, [request]);

const handleSave = async () => {
  try {

    await updateRequestStatus(request._id, status);

    toast.success("Request status updated.");

    onUpdated();

    onClose();

  } catch (err: any) {

    toast.error(
      err.response?.data?.message ||
      "Failed to update status."
    );

  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-8">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">
            Blood Request Details
          </h2>

          <button
            onClick={onClose}
            className="text-3xl font-bold text-gray-500 hover:text-red-600"
          >
            ×
          </button>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <Info
            label="Patient Name"
            value={request.patientName}
          />

          <Info
            label="Requester"
            value={`${request.requester?.bloodBridgeId} - ${request.requester?.name}`}
          />

          <Info
            label="Blood Group"
            value={request.bloodGroup}
          />

          <Info
            label="Units Required"
            value={`${request.unitsRequired} Units`}
          />

          <Info
            label="Hospital"
            value={request.hospitalName}
          />

          <Info
            label="Hospital City"
            value={request.hospitalCity}
          />

          <Info
            label="Contact Number"
            value={request.contactNumber}
          />

          <div className="col-span-2">

            <Info
              label="Hospital Address"
              value={request.hospitalAddress}
            />

          </div>

          <Info
            label="Urgency"
            value={request.urgency}
          />

          <div>

            <p className="text-sm text-gray-500 mb-1">
              Status
            </p>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border font-semibold outline-none transition
                ${
                  status === "Open"
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : status === "Accepted"
                    ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                    : status === "Completed"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-red-50 border-red-300 text-red-700"
                }`}
            >
              <option value="Open">🟦 Open</option>
              <option value="Accepted">🟨 Accepted</option>
              <option value="Completed">🟩 Completed</option>
              <option value="Cancelled">🟥 Cancelled</option>
            </select>

          </div>

          <Info
            label="Required Before"
            value={new Date(
              request.requiredBefore
            ).toLocaleDateString()}
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border"
          >
            Close
          </button>

          <button
            onClick={handleSave}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

interface InfoProps {
  label: string;
  value?: string | number;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div>

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value ?? "-"}
      </p>

    </div>
  );
}

export default RequestDetailsModal;