interface Props {
  status: "Open" | "Accepted" | "Completed" | string;
}

function StatusBadge({ status }: Props) {
  let styles =
    "bg-yellow-100 text-yellow-700";

  if (status === "Accepted") {
    styles =
      "bg-blue-100 text-blue-700";
  }

  if (status === "Completed") {
    styles =
      "bg-green-100 text-green-700";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;