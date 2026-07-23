import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-3">
            {value}
          </h2>
        </div>

        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-full">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;