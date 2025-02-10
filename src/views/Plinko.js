import React from "react";
import { GameProvider } from "../context/GameContext";
import PlinkoGame from "../components/Plinko/Plinko";
import Sidebar from "../components/Plinko/Sidebar";

const Plinko = () => {
  return (
    <GameProvider>
      <div className="flex-1 px-5">
        <div className="mx-auto mt-5 min-w-[300px] max-w-xl drop-shadow-xl md:mt-10 lg:max-w-7xl">
          <div className="flex flex-col-reverse overflow-hidden rounded-lg lg:w-full lg:flex-row">
            <Sidebar />
            <div className="flex-1">
              <PlinkoGame />
            </div>
          </div>
        </div>
      </div>
    </GameProvider>
  );
};

export default Plinko;
