import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const navigatePage = (direction: number) => {
    const nextPage = currentPage + direction;
    if (nextPage >= 1 && nextPage <= totalPages) {
      onPageChange(nextPage);
    }
  };

  return (
    <div className="bg-white py-2 text-center dark:bg-gray-900">
      <div className="inline-flex gap-1 rounded-full border border-gray-300  dark:border-white/10">
        <ul className="flex items-center gap-1">
          {/* Previous Button */}
          <li>
            <button
              onClick={() => navigatePage(-1)}
              disabled={currentPage === 1}
              className="flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:text-white dark:hover:bg-white/10"
            >
              ←
            </button>
          </li>

          {/* Page Numbers */}
          {pages.map((page) => (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full px-3 ${
                  currentPage === page
                    ? "bg-red-600 text-white"
                    : "text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next Button */}
          <li>
            <button
              onClick={() => navigatePage(1)}
              disabled={currentPage === totalPages}
              className="flex h-10 min-w-10 items-center justify-center rounded-full px-2 text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:text-white dark:hover:bg-white/10"
            >
              →
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
