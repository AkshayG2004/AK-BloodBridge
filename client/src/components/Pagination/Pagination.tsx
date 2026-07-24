import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  bordered?: boolean;
}

function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100],
  bordered = true,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const [goValue, setGoValue] = useState("");

  if (totalPages <= 1) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handleGo = () => {
    const page = Number(goValue);
    if (!page || page < 1 || page > totalPages) return;
    onPageChange(page);
    setGoValue("");
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 text-sm ${
        bordered ? "border-t border-gray-100 dark:border-gray-800" : ""
      }`}
    >

      <p className="text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {startItem}
        </span>
        –
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {totalItems}
        </span>{" "}
        records
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-gray-700 dark:text-gray-300 font-medium px-1 whitespace-nowrap">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 text-sm focus:outline-none focus:border-red-500"
          >
            {pageSizeOptions.map((size) => (
              <option
                key={size}
                value={size}
                className="dark:bg-gray-800 dark:text-gray-200"
              >
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">Go:</span>
          <input
            type="text"
            value={goValue}
            onChange={(e) => setGoValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGo()}
            onBlur={handleGo}
            placeholder={String(currentPage)}
            className="w-14 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 text-sm text-center focus:outline-none focus:border-red-500"
          />
        </div>

      </div>

    </div>
  );
}

export default Pagination;