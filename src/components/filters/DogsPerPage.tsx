type DogsPerPageProps = {
  itemsPerPage: number;
  handleItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const DogsPerPage: React.FC<DogsPerPageProps> = ({
  handleItemsPerPageChange,
  itemsPerPage,
}) => {
  return (
    <div className="wrapper">
      Dogs per page:
      <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="per-page-select">
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
      <style>{`
        .wrapper {
          color: var(--color-black);
          font-size: var(--h5);
          white-space: nowrap;
        }

        .per-page-select {
          margin-bottom: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 0 8px;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

export default DogsPerPage;
