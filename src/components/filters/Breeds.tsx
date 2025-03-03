import React, { useState, useEffect } from "react";

type BreedsProps = {
    selectedBreeds: Set<string>;
    setSelectedBreeds: (selectedBreeds: Set<string>) => void;
};

const Breeds: React.FC<BreedsProps> = ({
  selectedBreeds,
  setSelectedBreeds,
}) => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBreeds(
        breeds.filter((breed) =>
          breed.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBreeds(breeds);
    }
  }, [searchTerm, breeds]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch("/api/dogs/breeds", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setBreeds(data);
        setFilteredBreeds(data);
      } catch (error) {
        console.error("Error fetching breeds data:", error);
      }
    };

    fetchBreeds();
  }, []);

  const toggleBreed = (breed: string) => {
    const updatedSelectedBreeds = new Set(selectedBreeds);
    if (updatedSelectedBreeds.has(breed)) {
      updatedSelectedBreeds.delete(breed);
    } else {
      updatedSelectedBreeds.add(breed);
    }
    setSelectedBreeds(updatedSelectedBreeds);
  };

  return (
    <div className="filter-section">
      <h3>Breeds</h3>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search breeds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="breed-list">
        {filteredBreeds.length ? (
          filteredBreeds.map((breed) => (
            <label key={breed} className="breed-item">
              <input
                type="checkbox"
                className="breed-input"
                checked={selectedBreeds.has(breed)}
                onChange={() => toggleBreed(breed)}
              />
              {breed}
            </label>
          ))
        ) : (
          <p>No matching breeds.</p>
        )}
      </div>

      <style>
        {`
        h3 {
          font-size: var(--h5);
          margin-bottom: 0.5rem;
        }

        .search-container {
          margin-bottom: 0.5rem;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }

        .breed-list {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 0.5rem;
        }
          .breed-input {
            width: fit-content;
            margin-right: 8px;
          }

        .breed-item {
          display: block;
          padding: 0.25rem 0;
        }
        `}
      </style>
    </div>
  );
};

export default Breeds;
