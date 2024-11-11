import React, { useState } from 'react';
function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [activePage, setActivePage] = useState(currentPage || 1);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
      onPageChange(page);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(activePage - 2, 1);
    const endPage = Math.min(startPage + 4, totalPages);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-button px-3 py-1 rounded ${activePage === i ? 'bg-[#105193] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  return (
    <div className="flex justify-center items-center space-x-2 p-4">
      {/* Previous Button */}
      <button
        className={`p-2 bg-[#105193] text-white rounded ${activePage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handlePageChange(activePage - 1)}
        disabled={activePage === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Page Numbers */}
      {renderPageNumbers()}
      {/* Next Button */}
      <button
        className={`p-2 bg-[#105193] text-white rounded ${activePage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => handlePageChange(activePage + 1)}
        disabled={activePage === totalPages}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
export default Pagination;