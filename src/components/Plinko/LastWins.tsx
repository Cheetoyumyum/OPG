import React from "react";
import { useGame } from "../../context/GameContext";

const LastWins: React.FC<{ winCount?: number }> = ({ winCount = 4 }) => {
  const { state } = useGame();
  const lastWins = state.winRecords.slice(-winCount).reverse();

  return (
    <div
      className="flex flex-col overflow-hidden rounded-sm text-[8px] md:rounded-md lg:w-12 lg:text-sm"
      style={{
        width: "clamp(1.5rem, 0.893rem + 2.857vw, 2rem)",
        aspectRatio: `1 / ${winCount}`,
      }}
    >
      {lastWins.map((win) => (
        <div
          key={win.id}
          className="flex aspect-square items-center justify-center font-bold text-gray-950"
          style={{
            backgroundColor: state.binColors.background[win.binIndex],
          }}
        >
          {win.payout.multiplier}
          {win.payout.multiplier < 100 ? "×" : ""}
        </div>
      ))}
    </div>
  );
};

export default LastWins;
