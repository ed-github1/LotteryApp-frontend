const Pagination = ({ currentPage, totalPages, loading, handlePageChange }) => (
  <div className="flex justify-center items-center gap-4 mt-6 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1 || loading}
      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
    >
      Previous
    </button>
    <span className="text-white/80">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages || loading}
      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
    >
      Next
    </button>
  </div>
);

export default Pagination;