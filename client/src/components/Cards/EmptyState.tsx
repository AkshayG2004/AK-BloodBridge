interface Props {
  title: string;
  subtitle: string;
}

function EmptyState({
  title,
  subtitle,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-14 text-center">

      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      <p className="text-gray-500 mt-4">
        {subtitle}
      </p>

    </div>
  );
}

export default EmptyState;