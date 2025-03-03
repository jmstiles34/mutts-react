import { useEffect, useState } from "react";

type AgeRangeProps = {
  minAge: string;
  maxAge: string;
  ageError: string
  onChange: (minAge: string, maxAge: string, error: string) => void;
};

const AgeRange: React.FC<AgeRangeProps> = ({
  minAge,
  maxAge,
  ageError,
  onChange,
}) => {
  //let [ageError, setAgeError] = useState("");

  useEffect(() => {
    if (minAge !== "" && maxAge !== "") {
      if (parseInt(maxAge) < parseInt(minAge)) {
        /* setAgeError(
          "Maximum age must be greater than minimum age when specified."
        ); */
        onChange(
          minAge,
          maxAge,
          "Maximum age must be greater than minimum age when specified."
        );
      } else {
        //setAgeError("");
        onChange(minAge, maxAge, "");
      }
    } else {
      //setAgeError("");
      onChange(minAge, maxAge, "");
    }
  }, [minAge, maxAge]);

  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, maxAge, ageError);
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(minAge, e.target.value, ageError);
  };

  return (
    <div className="filter-section">
      <h3>Age Range</h3>
      <div className="age-inputs">
        <label>
          Minimum Age:
          <input
            className={ageError ? "errorAge" : ""}
            type="number"
            min="0"
            value={minAge}
            onChange={handleMinAgeChange}
            placeholder="Enter a Number"
          />
        </label>
        <label>
          Maximum Age:
          <input
            className={ageError ? "errorAge" : ""}
            type="number"
            min="0"
            value={maxAge}
            onChange={handleMaxAgeChange}
            placeholder="Enter a Number"
          />
        </label>
        {ageError && <div className="error-message">{ageError}</div>}
      </div>

      <style>{`
        h3 {
          font-size: var(--h5);
          margin-bottom: 0.5rem;
        }

        .age-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .age-inputs input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }

        .age-inputs input.errorAge {
          border-color: var(--color-red-500);
        }

        .error-message {
          color: var(--color-red-500);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default AgeRange;
