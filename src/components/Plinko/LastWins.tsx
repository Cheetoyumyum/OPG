import React from "react";
import { useGame } from "../../context/GameContext";

interface LastWinsProps {
  winCount?: number;
  orientation?: "horizontal" | "vertical";
}

const LastWins: React.FC<LastWinsProps> = ({
  winCount = 4,
  orientation = "vertical",
}) => {
  const { state } = useGame();
  const lastWins = state.winRecords.slice(-winCount).reverse();
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="flex flex-col gap-1">
      {lastWins.map((win) => (
        <div
          key={win.id}
          className={`flex items-center justify-center rounded bg-orange-300/90 text-sm font-bold text-gray-950 shadow-md transition-colors duration-200 ${
            isMobile ? "h-6 w-10 text-sm" : "h-8 w-16"
          }`}
          style={{
            backgroundColor: state.binColors.background[win.binIndex],
          }}
        >
          <div className="flex items-baseline">
            {win.payout.multiplier}
            {win.payout.multiplier < 100 && (
              <span
                className={`ml-0.5 ${
                  isMobile ? "text-[0.6em]" : "text-[0.7em]"
                }`}
              >
                ×
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LastWins;
