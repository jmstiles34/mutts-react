export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};

export type Location = {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
};

export type Coordinates = {
  lat: number;
  lon: number;
};

export type SearchResponse = {
  resultIds: string[];
  total: number;
  next: string;
  prev: string;
};

export type MatchResponse = {
  match: string;
};

export interface FormElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
}

export type PagingState = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pages: number[];
  resetPaging: () => void;
};

export type FiltersState = {
  selectedBreeds: Set<string>;
  minAge: string;
  maxAge: string;
  ageError: string;
  sortField: string;
  sortOrder: string;
  itemsPerPage: number;
  resetFilters: () => void;
};
