import React, { useEffect, useRef } from "react";
import { binColorsByRowCount, binPayouts } from "../../constants/game";
import { useGame } from "../../context/GameContext";
import PlinkoEngine from "./PlinkoEngine";

interface BinsRowProps {
  engine: PlinkoEngine | null;
}

const BinsRow: React.FC<BinsRowProps> = ({ engine }) => {
  const { state } = useGame();
  const { riskLevel, rowCount, winRecords } = state;
  const plinkoEngine = engine ?? state.plinkoEngine;

  // Store refs to animations for each bin
  const binAnimationsRef = useRef<(Animation | null)[]>([]);

  // Initialize animation refs array when rowCount changes
  useEffect(() => {
    binAnimationsRef.current = new Array(rowCount + 1).fill(null);
  }, [rowCount]);

  const initAnimation = (node: HTMLDivElement | null, index: number) => {
    if (!node) return;

    const bounceAnimation = node.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(30%)" },
        { transform: "translateY(0)" },
      ],
      {
        duration: 300,
        easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)",
      }
    );
    bounceAnimation.pause();
    binAnimationsRef.current[index] = bounceAnimation;
  };

  const playAnimation = (binIndex: number) => {
    const animation = binAnimationsRef.current[binIndex];
    if (!animation) return;

    animation.cancel();
    animation.play();
  };

  // Watch for new wins and trigger animation
  useEffect(() => {
    if (winRecords.length > 0) {
      const lastWinBinIndex = winRecords[winRecords.length - 1].binIndex;
      requestAnimationFrame(() => playAnimation(lastWinBinIndex));
    }
  }, [winRecords]);

  if (!plinkoEngine) return null;

  return (
    <div className="flex h-auto w-full justify-center">
      <div
        className="flex gap-[1px]"
        style={{ width: `${(plinkoEngine.binsWidthPercentage ?? 0) * 100}%` }}
      >
        {binPayouts[rowCount][riskLevel].map((payout, binIndex) => (
          <div
            key={binIndex}
            ref={(node) => initAnimation(node, binIndex)}
            className="relative flex min-w-0 flex-1 items-center justify-center py-2 text-xs font-bold text-gray-950 sm:text-sm"
            style={{
              backgroundColor: state.binColors.background[binIndex],
            }}
          >
            <div className="flex items-baseline">
              {payout}
              {payout < 100 && <span className="ml-0.5 text-[0.7em]">×</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinsRow;
