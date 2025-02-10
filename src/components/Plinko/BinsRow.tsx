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
    <div className="flex h-[clamp(10px,0.352px+2.609vw,16px)] w-full justify-center lg:h-7">
      <div
        className="flex gap-[1%]"
        style={{ width: `${(plinkoEngine.binsWidthPercentage ?? 0) * 100}%` }}
      >
        {binPayouts[rowCount][riskLevel].map((payout, binIndex) => (
          <div
            key={binIndex}
            ref={(node) => initAnimation(node, binIndex)}
            className="flex min-w-0 flex-1 items-center justify-center rounded-sm text-[clamp(6px,2.784px+0.87vw,8px)] font-bold text-gray-950 shadow-[0_2px_var(--shadow-color)] lg:rounded-md lg:text-[clamp(10px,-16.944px+2.632vw,12px)] lg:shadow-[0_3px_var(--shadow-color)]"
            style={
              {
                backgroundColor:
                  binColorsByRowCount[rowCount].background[binIndex],
                "--shadow-color":
                  binColorsByRowCount[rowCount].shadow[binIndex],
              } as React.CSSProperties
            }
          >
            {payout}
            {payout < 100 ? "×" : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinsRow;
