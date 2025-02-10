import React from "react";
import { GameProvider } from "../context/GameContext";
import PlinkoGame from "../components/Plinko/Plinko";
import ControlPanel from "../components/Plinko/ControlPanel";

const Plinko = () => {
  return (
    <GameProvider>
      <div className="flex-1 px-5 py-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
        <div className="mx-auto mt-5 min-w-[300px] max-w-xl md:mt-10 lg:max-w-7xl">
          <div className="flex flex-col-reverse overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm shadow-2xl lg:w-full lg:flex-row">
            <ControlPanel />
            <div className="flex-1 border-b border-gray-700 lg:border-b-0 lg:border-l">
              <PlinkoGame />
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default Plinko;
