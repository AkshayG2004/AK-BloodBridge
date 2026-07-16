import User from "../models/User";

const generateBloodBridgeId = async (): Promise<string> => {
  const userCount = await User.countDocuments();

  const nextNumber = userCount + 1;

  return `AKB${nextNumber.toString().padStart(6, "0")}`;
};

export default generateBloodBridgeId;