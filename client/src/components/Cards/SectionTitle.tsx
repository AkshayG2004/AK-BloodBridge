interface Props {
  title: string;
  subtitle: string;
}

function SectionTitle({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-8">

      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </p>

    </div>
  );
}

export default SectionTitle;