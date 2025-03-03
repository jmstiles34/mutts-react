type MatchCardProps = {
  generateMatch: () => void;
};

const MatchCard: React.FC<MatchCardProps> = ({ generateMatch }) => {
  return (
    <div className="match-card">
      <p>
        Look at all the amazing mutts you've selected! Any one of them could be
        your new best friend. Ready to discover your perfect match?
      </p>
      <button className="circular-button" onClick={generateMatch}>
        <svg viewBox="0 0 100 100">
          <path
            id="curve"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0"
            fill="transparent"
          />
          <text className="circular-text">
            <textPath href="#curve" startOffset="5%">
              Show Me My Mutt!
            </textPath>
          </text>
        </svg>
        <img
          src="/dog-paw.svg"
          className="paw-image"
          alt="Red speech bubble with word 'hi' inside followed by red word marley"
        />
      </button>

      <style>
        {`
        .match-card {
		background-color: var(--color-white);
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
    display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
	}

	p {
		margin: 0.25rem 0;
		color: var(--color-black);
	}

	.circular-button {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: none;
      background-color: var(--color-green);
      cursor: pointer;
      position: relative;
      transition: transform 0.3s;
			align-self: center;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			margin-top: auto;
			margin-bottom: auto;
    }

    .circular-button:hover {
			.paw-image {
      	transform: translateY(-110px) scale(1.10);
			}
    }

    .circular-text {
      fill: white;
      font-size: 12px;
			font-weight: bold;
    }

		.paw-image {
			transform: translateY(-110px);
			width: 65%;
			margin: 0 auto;
			transition: transform 0.3s;
		}
        `}
      </style>
    </div>
  );
};

export default MatchCard;
