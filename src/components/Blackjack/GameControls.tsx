import React from "react";

interface GameControlsProps {
  gameState: any;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  betAmount: number;
  onBet: () => void;
  isGameActive: boolean;
  canSplit: boolean;
  canDouble: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onHit,
  onStand,
  onDouble,
  onSplit,
  betAmount,
  onBet,
  isGameActive,
  canSplit,
  canDouble,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onHit}
          className="bg-[#1E2328] text-[#4ADE80] py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={!gameState.isGameActive}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4v16m0-16l-4 4m4-4l4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Hit
        </button>
        <button
          onClick={onStand}
          className="bg-[#1E2328] text-[#EF4444] py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={!gameState.isGameActive}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 12H4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Stand
        </button>
        <button
          onClick={onSplit}
          className={`bg-[#1E2328] py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 ${
            !gameState.isGameActive || !canSplit
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "text-[#60A5FA]"
          }`}
          disabled={!gameState.isGameActive || !canSplit}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4v16m-6-8h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Split
        </button>
        <button
          onClick={onDouble}
          className={`bg-[#1E2328] py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 ${
            !gameState.isGameActive || !canDouble
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "text-[#F59E0B]"
          }`}
          disabled={!gameState.isGameActive || !canDouble}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4v16m-6-8h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 16l16-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Double
        </button>
      </div>

      {/* Bet Button */}
      <button
        onClick={onBet}
        disabled={isGameActive || betAmount <= 0}
        className="w-full bg-[#1ffdb0] text-[#131a22] py-3 rounded-md font-semibold transition-colors hover:bg-[#1ae69f] disabled:bg-neutral-600 disabled:text-neutral-400"
      >
        Bet
      </button>
    </div>
  );
};

export default GameControls;
