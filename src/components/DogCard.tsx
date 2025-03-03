import type { Dog } from "../types";

/**
 * DogCard component props
 * @typedef {Object} DogCardProps
 * @property {Dog} dog - The dog data to display
 * @property {string|null} [matchedDogId=null] - ID of the matched dog, if any
 * @property {Set<Dog>} favorites - Set of favorite dogs
 * @property {(dog: Dog) => void} toggleFavorite - Function to toggle favorite status
 */

type DogCardProps = {
  dog: Dog;
  matchedDogId?: string | null;
  favorites: Set<Dog>;
  toggleFavorite: (d: Dog) => void;
};

const DogCard: React.FC<DogCardProps> = ({
  dog,
  matchedDogId = null,
  favorites,
  toggleFavorite,
}) => {
  const isMatched = matchedDogId === dog.id;
  const isFavorited = favorites.has(dog);

  return (
    <div
      id={`dog-${dog.id}`}
      className={`dog-card ${isMatched ? "matched" : ""}`}
      style={{
        backgroundColor: "var(--color-white)",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        position: "relative",
        ...(isMatched && {
          backgroundColor: "var(--color-yellow)",
          transform: "scale(1.08)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }),
      }}
    >
      <img
        src={dog.img}
        alt={dog.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <div
        className="dog-info"
        style={{
          padding: "0.5rem",
          paddingBottom: 0,
        }}
      >
        <h3
          style={{
            fontSize: "var(--h5)",
            color: "var(--color-black)",
          }}
        >
          {dog.name}
        </h3>
        <p
          style={{
            margin: "0.25rem 0",
            color: "var(--color-black)",
          }}
        >
          Breed: {dog.breed}
        </p>
        <p
          style={{
            margin: "0.25rem 0",
            color: "var(--color-black)",
          }}
        >
          Age: {dog.age} years
        </p>
        <p
          style={{
            margin: "0.25rem 0",
            color: "var(--color-black)",
          }}
        >
          Location: {dog.zip_code}
        </p>
        <button
          className={`favorite-button ${isMatched ? "matchFav" : ""} ${isFavorited ? "favorited" : ""}`}
          onClick={() => toggleFavorite(dog)}
          style={{
            fontSize: "var(--h3)",
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            padding: 0,
            backgroundColor: isMatched
              ? "var(--color-yellow)"
              : "var(--color-white)",
            borderRadius: "12px",
            height: "40px",
            width: "40px",
            textAlign: "center",
          }}
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

export default DogCard;
