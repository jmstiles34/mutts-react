import React, { useEffect, useState } from "react";

const BackToTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const scrollToTop = () => {
    const searchResults = document.querySelector("#search-results");
    searchResults?.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

const handleScroll = () => {
  const searchResults = document.querySelector("#search-results");
  if (searchResults) {
    const scrollPosition = searchResults.scrollTop;
    const halfway = searchResults.scrollHeight / 4;
    setShowButton(scrollPosition > halfway);
  }
};

  useEffect(() => {
    const searchResults = document.querySelector("#search-results");
    searchResults?.addEventListener("scroll", handleScroll);
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    return () => {
      searchResults?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <button
        className="back-to-top"
        onClick={scrollToTop}
        style={{ display: showButton ? "block" : "none" }}
        aria-label="Scroll to top"
      >
        <i className="fa-solid fa-arrow-up fa-xl"></i>
      </button>
      <style>
        {`
        .back-to-top {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		background-color: var(--color-burgundy);
		color: var(--color-white);
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		text-align: center;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
	}

	.back-to-top:hover {
		background-color: var(--color-olive);
		transform: translateY(-2px);
	}

	.back-to-top:active {
		transform: translateY(0);
	}
        `}
      </style>
    </>
  );
};

export default BackToTopButton;
