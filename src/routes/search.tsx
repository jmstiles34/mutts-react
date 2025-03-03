import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "../contexts";
import type {
  Dog,
  SearchResponse,
  MatchResponse,
  PagingState,
  FiltersState,
} from "../types";
import DogCard from "../components/DogCard";
import MatchCard from "../components/MatchCard";
import Breeds from "../components/filters/Breeds";
import AgeRange from "../components/filters/AgeRange";
import SortBy from "../components/filters/SortBy";
import Pagination from "../components/Pagination";
import BackToTop from "../components/BackToTop";
import DogsPerPage from "../components/filters/DogsPerPage";
import styles from "./search.module.css";

export const Route = createFileRoute("/search")({
  component: Search,
});

function Search() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Set<Dog>>(new Set());
  const [matchedDogId, setMatchedDogId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"search" | "favorites">("search");

  const [filters, setFilters] = useState<FiltersState>({
    selectedBreeds: new Set<string>(),
    minAge: "",
    maxAge: "",
    ageError: "",
    sortField: "breed",
    sortOrder: "asc",
    itemsPerPage: 25,
    resetFilters: () => {
      setFilters((prev) => ({
        ...prev,
        selectedBreeds: new Set<string>(),
        minAge: "",
        maxAge: "",
        sortField: "breed",
        sortOrder: "asc",
        ageError: "",
      }));
    },
  });

  const [paging, setPaging] = useState<PagingState>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pages: [1, 2, 3, 4, 5],
    resetPaging: () => {
      setPaging((prev) => ({
        ...prev,
        currentPage: 1,
      }));
    },
  });

  const buildSearchString = (): string => {
    let searchString = `sort=${filters.sortField}:${filters.sortOrder}&size=${filters.itemsPerPage}`;

    if (filters.selectedBreeds.size) {
      searchString +=
        "&" +
        Array.from(filters.selectedBreeds)
          .map((breed) => `breeds[]=${encodeURIComponent(breed)}`)
          .join("&");
    }

    if (parseInt(filters.minAge) > 0) {
      searchString += `&ageMin=${filters.minAge}`;
    }

    if (parseInt(filters.maxAge) > 0) {
      searchString += `&ageMax=${filters.maxAge}`;
    }

    if (paging.currentPage > 1) {
      searchString += `&from=${(paging.currentPage - 1) * filters.itemsPerPage}`;
    }

    return searchString;
  };

  const searchDogs = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/dogs/search?${buildSearchString()}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If API access unauthorized then bounce to login screen
      if (response.status === 401) {
        navigate;
        ({
          to: "/",
        });
        return;
      }

      const { resultIds, total }: SearchResponse = await response.json();

      if (resultIds.length) {
        const dogsResponse = await fetch("/api/dogs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resultIds),
          credentials: "include",
        });

        const fetchedDogs = await dogsResponse.json();
        setDogs(fetchedDogs);
        setPaging((prev) => ({
          ...prev,
          totalItems: total,
          totalPages: Math.ceil(total / filters.itemsPerPage),
        }));
      } else {
        setDogs([]);
        setPaging((prev) => ({
          ...prev,
          totalItems: 0,
          totalPages: 0,
        }));
      }
    } catch (err) {
      setError("Failed to fetch dogs");
    } finally {
      setLoading(false);
    }
  };

  const generateMatch = async (): Promise<void> => {
    if (favorites.size === 0) {
      setError("Please favorite at least one dog first");
      return;
    }

    const dogIds = Array.from(favorites).map((fav) => fav.id);

    try {
      const response = await fetch("/api/dogs/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogIds),
        credentials: "include",
      });

      const { match }: MatchResponse = await response.json();
      setMatchedDogId(match);
      scrollToCard(match);
    } catch (err) {
      setError("Failed to generate match");
    }
  };

  const scrollToCard = (id: string): void => {
    const card = document.getElementById(`dog-${id}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const toggleFavorite = (dog: Dog): void => {
    const newFavorites = new Set(favorites);

    if (newFavorites.has(dog)) {
      newFavorites.delete(dog);
    } else {
      newFavorites.add(dog);
    }

    setFavorites(newFavorites);

     if (newFavorites.size) {
      localStorage.setItem(
        `${session.name}_favs`,
        JSON.stringify(Array.from(newFavorites))
      );
    } else {
      localStorage.removeItem(`${session.name}_favs`);
    }
  };

  const calcPages = (currentPage: number, totalPages: number) => {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageChange = async (newPage: number): Promise<void> => {
    if (newPage < 1 || newPage > paging.totalPages) return;

    setPaging((prev) => ({
      ...prev,
      currentPage: newPage,
      pages: calcPages(newPage, paging.totalPages),
    }));
  };

  const handleItemsPerPageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const newItemsPerPage = Number(event.target.value);

    setFilters((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
    }));
  };

  const handleApplyFilters = (): void => {
    if (!filters.ageError) {
      setPaging((prev) => ({
        ...prev,
        currentPage: 1,
      }));
      searchDogs();
    }
  };

  const getStoredFavorites = (): Set<Dog> => {
    const storedFavorites = localStorage.getItem(`${session.name}_favs`);
    return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set();
  };

  // Initial load
  useEffect(() => {
    const storedFavorites = getStoredFavorites();
    setFavorites(storedFavorites);
    searchDogs();
  }, []);

  // Effect to run searchDogs when paging or filters change
  useEffect(() => {
    if (!loading) {
      searchDogs();
    }
  }, [paging.currentPage, filters.itemsPerPage]);

  return (
    <section className={styles.dogsContainer}>
      <div className={styles.filters}>
        <Breeds
          selectedBreeds={filters.selectedBreeds}
          setSelectedBreeds={(newBreeds: Set<string>) =>
            setFilters((prev) => ({
              ...prev,
              selectedBreeds: new Set(newBreeds),
            }))
          }
        />
        <AgeRange
          minAge={filters.minAge}
          maxAge={filters.maxAge}
          ageError={filters.ageError}
          onChange={(min: string, max: string, error: string) =>
            setFilters((prev) => ({
              ...prev,
              minAge: min,
              maxAge: max,
              ageError: error,
            }))
          }
        />
        <SortBy
          sortField={filters.sortField}
          sortOrder={filters.sortOrder}
          onChange={(field: string, order: string) =>
            setFilters((prev) => ({
              ...prev,
              sortField: field,
              sortOrder: order,
            }))
          }
        />

        <button className={styles.searchButton} onClick={handleApplyFilters}>
          Apply Filters
        </button>
        <button
          className={styles.resetButton}
          onClick={() => {
            filters.resetFilters();
            paging.resetPaging();
            searchDogs();
          }}
        >
          Reset Filters
        </button>
      </div>

      <div id="search-results" className={styles.searchResults}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.tabs}>
          <button
            className={activeTab === "search" ? styles.active : ""}
            onClick={() => setActiveTab("search")}
          >
            Search Results
          </button>
          <button
            className={activeTab === "favorites" ? styles.active : ""}
            onClick={() => setActiveTab("favorites")}
          >
            Favorite Dogs ({favorites.size})
          </button>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading dogs...</p>
        ) : activeTab === "favorites" ? (
          favorites.size ? (
            <div className={styles.dogsGrid}>
              <MatchCard generateMatch={generateMatch} />
              {Array.from(favorites).map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  matchedDogId={matchedDogId}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className={styles.paginationInfo}>
              No favorites selected...
            </div>
          )
        ) : (
          <>
            <div className={styles.paginationInfo}>
              <div>
                Showing {(paging.currentPage - 1) * filters.itemsPerPage + 1} -
                {Math.min(
                  paging.currentPage * filters.itemsPerPage,
                  paging.totalItems
                )}{" "}
                of {paging.totalItems} dogs
              </div>
              <DogsPerPage
                itemsPerPage={filters.itemsPerPage}
                handleItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
            <div className={styles.dogsGrid}>
              {dogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            <Pagination
              currentPage={paging.currentPage}
              totalPages={paging.totalPages}
              pages={paging.pages}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <BackToTop />
    </section>
  );
}
