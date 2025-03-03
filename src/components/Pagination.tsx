type PaginationProps = {
  handlePageChange: (pageNum: number) => void;
  currentPage: number;
  totalPages: number;
  pages: number[];
};

const Pagination: React.FC<PaginationProps> = ({
  handlePageChange,
  currentPage,
  totalPages,
  pages,
}) => {
  return (
    <div className="pagination-container">
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          «
        </button>

        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ‹
        </button>

        {pages.map((pageNum) => (
          <button
            key={pageNum}
            className={`pagination-button ${pageNum === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ›
        </button>

        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          »
        </button>
      </div>

      <style>
        {`
        .pagination-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: .5rem;
        }

        .pagination {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-top: 1rem;
        }

        .pagination-button {
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-border);
          background-color: var(--color-white);
          cursor: pointer;
          border-radius: 4px;
          min-width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: var(--color-black);
        }

        .pagination-button:hover:not(:disabled) {
          background-color: #f0f0f0;
          border-color: #bbb;
        }

        .pagination-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .pagination-button.active {
          background-color: var(--color-olive);
          color: white;
          border-color: var(--color-olive);
        }
        `}
      </style>
    </div>
  );
};

export default Pagination;
