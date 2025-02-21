import React, { useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import PlinkoEngine from "./PlinkoEngine";
import BinsRow from "./BinsRow";
import LastWins from "./LastWins";

const Plinko: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setPlinkoEngine, addWinRecord } = useGame();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { WIDTH, HEIGHT } = PlinkoEngine;
  const engineRef = useRef<PlinkoEngine | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      if (!engineRef.current) {
        // Initialize engine if it doesn't exist
        engineRef.current = new PlinkoEngine(
          canvasRef.current,
          {
            betAmount: state.betAmount,
            rowCount: state.rowCount,
            riskLevel: state.riskLevel,
          },
          addWinRecord
        );
        engineRef.current.start();
        setPlinkoEngine(engineRef.current);
      } else {
        // Update existing engine if state changes
        engineRef.current.updateGameState({
          betAmount: state.betAmount,
          rowCount: state.rowCount,
          riskLevel: state.riskLevel,
        });
      }

      return () => {
        engineRef.current?.stop();
        engineRef.current = null;
        setPlinkoEngine(null);
      };
    }
  }, [state.rowCount, state.riskLevel, state.betAmount]);

  return (
    <div className="bg-gray-900 py-2 sm:py-4 lg:py-8">
      <div
        className="relative mx-auto flex w-full flex-col lg:w-auto"
        style={{ maxWidth: `${WIDTH}px` }}
      >
        <div
          className="relative w-full bg-[#0f1728] rounded-lg overflow-hidden"
          style={{
            height: isMobile ? `min(${HEIGHT}px, 30vh)` : `${HEIGHT}px`,
          }}
        >
          {!state.plinkoEngine && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xl text-slate-600 animate-spin">
                Loading...
              </div>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="absolute inset-0 w-full h-full"
          />

          <div className="absolute right-4">
            <LastWins winCount={4} />
          </div>
        </div>

        <div className="w-full">
          <BinsRow engine={state.plinkoEngine} />
        </div>
      </div>
    </div>
  );
};

export default Plinko;
