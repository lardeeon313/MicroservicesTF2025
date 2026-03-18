import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

export function usePagination<T>(items: T[], itemsPerPage = ITEMS_PER_PAGE) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Si los datos cambian y la página actual queda fuera de rango, volvemos a 1
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, safePage, itemsPerPage]);

  const goToPage = (page: number) => setCurrentPage(page);

  // Resetear a página 1 (útil al cambiar de tab)
  const reset = () => setCurrentPage(1);

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    goToPage,
    reset,
  };
}