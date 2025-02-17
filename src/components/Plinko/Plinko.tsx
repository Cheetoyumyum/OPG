import React, { useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";
import PlinkoEngine from "./PlinkoEngine";
import BinsRow from "./BinsRow";
import LastWins from "./LastWins";

const Plinko: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setPlinkoEngine, addWinRecord } = useGame();
  const { WIDTH, HEIGHT } = PlinkoEngine;
  const engineRef = useRef<PlinkoEngine | null>(null);

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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-4 lg:py-8">
      <div
        className="mx-auto flex flex-col w-full lg:w-auto"
        style={{ maxWidth: `${WIDTH}px` }}
      >
        <div
          className="relative w-full bg-[#0f1728] rounded-lg overflow-hidden"
          style={{ height: `${HEIGHT}px` }}
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
            className="absolute inset-0"
          />
        </div>
        <div className="w-full">
          <BinsRow engine={state.plinkoEngine} />
        </div>
      </div>
      <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2">
        <LastWins />
      </div>
    </div>
  );
};

export default Plinko;
