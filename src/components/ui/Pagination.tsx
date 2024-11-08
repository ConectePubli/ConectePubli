import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, setPage }) => {
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={handlePreviousPage}
        disabled={page === 1 || page === 0}
        className={`flex items-center px-4 py-2 rounded-lg ${
          page === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-[#10438F] text-white"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
        Anterior
      </button>
      <div className="flex items-center flex-row gap-1">
        <p className="hidden sm-plus:block">Página</p>
        <span>
          {totalPages === 0 ? 0 : page} de {totalPages}
        </span>
      </div>
      <button
        onClick={handleNextPage}
        disabled={page === totalPages || page === 0 || totalPages === 0}
        className={`flex items-center px-4 py-2 rounded-lg ${
          page === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-[#10438F] text-white"
        }`}
      >
        Próxima
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
