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

      <h1 className="text-5xl font-bold">
        {title}
      </h1>

      <p className="text-gray-500 mt-2 text-lg">
        {subtitle}
      </p>

    </div>
  );
}

export default SectionTitle;