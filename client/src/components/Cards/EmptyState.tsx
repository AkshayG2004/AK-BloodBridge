interface Props {
  title: string;
  subtitle: string;
}

function EmptyState({
  title,
  subtitle,
}: Props) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-md p-14 text-center transition-colors">

      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-4">
        {subtitle}
      </p>

    </div>
  );
}

export default EmptyState;