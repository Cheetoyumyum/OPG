import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_BALANCE } from "../constants/game";
import { binColor } from "../constants/game";
import { interpolateRgbColors } from "../utils/colors";
import type {
  BetAmountOfExistingBalls,
  GameState,
  WinRecord,
} from "../types/game";
import { RowCount } from "../constants/game";
import { RiskLevel } from "../types/game";
import PlinkoEngine from "../components/Plinko/PlinkoEngine";

const GameContext = createContext<{
  state: GameState;
  setPlinkoEngine: (engine: PlinkoEngine | null) => void;
  setBetAmount: (amount: number) => void;
  setBetAmountOfExistingBalls: (balls: BetAmountOfExistingBalls) => void;
  setRowCount: (count: RowCount) => void;
  setRiskLevel: (level: RiskLevel) => void;
  addWinRecord: (record: WinRecord) => void;
  updateBalance: (newBalance: number) => void;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GameState>({
    plinkoEngine: null,
    betAmount: 1,
    betAmountOfExistingBalls: {},
    rowCount: 8,
    riskLevel: RiskLevel.MEDIUM,
    winRecords: [],
    totalProfitHistory: [0],
    balance: DEFAULT_BALANCE,
    binColors: calculateBinColors(16),
  });

  function calculateBinColors(rowCount: number) {
    const binCount = rowCount + 1;
    const isBinsEven = binCount % 2 === 0;
    const redToYellowLength = Math.ceil(binCount / 2);

    const redToYellowBg = interpolateRgbColors(
      binColor.background.red,
      binColor.background.yellow,
      redToYellowLength
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

    const redToYellowShadow = interpolateRgbColors(
      binColor.shadow.red,
      binColor.shadow.yellow,
      redToYellowLength
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

    return {
      background: [
        ...redToYellowBg,
        ...redToYellowBg.toReversed().slice(isBinsEven ? 0 : 1),
      ],
      shadow: [
        ...redToYellowShadow,
        ...redToYellowShadow.toReversed().slice(isBinsEven ? 0 : 1),
      ],
    };
  }

  // useEffect(() => {
  //   const rawValue = window.localStorage.getItem("plinko_balance");
  //   const parsedValue = parseFloat(rawValue ?? "");
  //   if (!isNaN(parsedValue)) {
  //     setState((prev) => ({ ...prev, balance: parsedValue }));
  //   }
  // }, []);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      binColors: calculateBinColors(prev.rowCount),
    }));
  }, []);

  const value = {
    state,
    setPlinkoEngine: (engine: PlinkoEngine | null) =>
      setState((prev) => ({ ...prev, plinkoEngine: engine })),
    setBetAmount: (amount: number) =>
      setState((prev) => ({ ...prev, betAmount: amount })),
    setBetAmountOfExistingBalls: (balls: BetAmountOfExistingBalls) =>
      setState((prev) => ({ ...prev, betAmountOfExistingBalls: balls })),
    setRowCount: (count: RowCount) =>
      setState((prev) => ({
        ...prev,
        rowCount: count,
        binColors: calculateBinColors(count),
      })),
    setRiskLevel: (level: RiskLevel) =>
      setState((prev) => ({ ...prev, riskLevel: level })),
    addWinRecord: (record: WinRecord) =>
      setState((prev) => ({
        ...prev,
        winRecords: [...prev.winRecords, record],
        totalProfitHistory: [
          ...prev.totalProfitHistory,
          prev.totalProfitHistory[prev.totalProfitHistory.length - 1] +
            record.profit,
        ],
      })),
    updateBalance: (newBalance: number) =>
      setState((prev) => ({ ...prev, balance: newBalance })),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
