export interface BloodRequest {
  _id: string;

  patientName: string;
  bloodGroup: string;
  unitsRequired: number;

  hospitalName: string;
  hospitalCity: string;
  hospitalAddress: string;

  contactPerson: string;
  contactNumber: string;

  urgency: "Low" | "Medium" | "High" | "Critical";
  requiredBefore: string;

  notes?: string;

  status: "Open" | "Accepted" | "Completed";

  requester?: {
    _id: string;
    bloodBridgeId: string;
    name: string;
    phone: string;
    city: string;
  };

  acceptedBy?: {
    _id: string;
    bloodBridgeId: string;
    name: string;
    phone: string;
    city: string;
  };

  createdAt: string;
  updatedAt: string;
}