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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-xl transition duration-300 h-full">

      <div className="flex justify-between items-start gap-1 sm:gap-2 h-full">

        <div className="min-w-0 flex flex-col h-full">
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-tight line-clamp-3 min-h-[2.5rem] sm:min-h-[2.5rem]">
            {title}
          </p>

          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-auto truncate">
            {value}
          </h2>
        </div>

        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 sm:p-4 rounded-full shrink-0">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;