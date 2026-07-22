import User from "../models/User";

const generateBloodBridgeId = async (): Promise<string> => {

  const lastUser = await User.findOne()
    .sort({ bloodBridgeId: -1 })
    .select("bloodBridgeId");

  if (!lastUser) {
    return "AKB000001";
  }

  const lastNumber = Number(
    lastUser.bloodBridgeId.replace("AKB", "")
  );

  const nextNumber = lastNumber + 1;

  return `AKB${nextNumber.toString().padStart(6, "0")}`;
};

export default generateBloodBridgeId;