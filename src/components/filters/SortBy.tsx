type SortByProps = {
  sortField: string;
  sortOrder: string;
  onChange: (field: string, order: string) => void;
}

const SortBy: React.FC<SortByProps> = ({ sortField, sortOrder, onChange }) => {
  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value, sortOrder);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(sortField, e.target.value);
  };

  return (
    <div className="filter-section">
      <h3>Sort By</h3>
      <select
        value={sortField}
        onChange={handleSortFieldChange}
        className="sort-by-select"
      >
        <option value="name">Name</option>
        <option value="breed">Breed</option>
        <option value="age">Age</option>
      </select>

      <div className="sort-order">
        <label className="radio-label">
          <input
            type="radio"
            name="sortOrder"
            value="asc"
            checked={sortOrder === "asc"}
            onChange={handleSortOrderChange}
          />
          Ascending
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="sortOrder"
            value="desc"
            checked={sortOrder === "desc"}
            onChange={handleSortOrderChange}
          />
          Descending
        </label>
      </div>

      <style>{`
        h3 {
          font-size: var(--h5);
          margin-bottom: 0.5rem;
        }

        .sort-by-select {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }

        .sort-order {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .radio-label input[type="radio"] {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SortBy;
