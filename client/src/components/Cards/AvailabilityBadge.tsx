interface Props {
  availability: string;
}

function AvailabilityBadge({ availability }: Props) {
  let color = "";

  switch (availability) {
    case "Available":
      color = "bg-green-100 text-green-700";
      break;

    case "Busy":
      color = "bg-yellow-100 text-yellow-700";
      break;

    case "Unavailable":
      color = "bg-red-100 text-red-700";
      break;

    default:
      color = "bg-gray-100 text-gray-700";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}
    >
      {availability}
    </span>
  );
}

export default AvailabilityBadge;