import React, { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { BetMode, RiskLevel } from "../../types/game";
import {
  RowCount,
  rowCountOptions,
  autoBetIntervalMs,
} from "../../constants/game";
import { FaInfinity, FaGear, FaChartLine, FaQuestion } from "react-icons/fa6";

const Sidebar: React.FC = () => {
  const { state, setBetAmount, setRiskLevel, setRowCount } = useGame();
  const [betMode, setBetMode] = useState<BetMode>(BetMode.MANUAL);
  const [autoBetInput, setAutoBetInput] = useState(0);
  const [autoBetsLeft, setAutoBetsLeft] = useState<number | null>(null);
  const [autoBetInterval, setAutoBetInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const isBetAmountNegative = state.betAmount < 0;
  const isBetExceedBalance = state.betAmount > state.balance;
  const isAutoBetInputNegative = autoBetInput < 0;
  const hasOutstandingBalls =
    Object.keys(state.betAmountOfExistingBalls).length > 0;

  const isDropBallDisabled =
    !state.plinkoEngine ||
    isBetAmountNegative ||
    isBetExceedBalance ||
    isAutoBetInputNegative;

  const handleBetAmountFocusOut = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(e.target.value.trim());
    if (isNaN(parsedValue)) {
      setBetAmount(0);
    } else {
      setBetAmount(parsedValue);
    }
  };

  const resetAutoBetInterval = () => {
    if (autoBetInterval) {
      clearInterval(autoBetInterval);
      setAutoBetInterval(null);
    }
  };

  const autoBetDropBall = () => {
    if (isBetExceedBalance) {
      resetAutoBetInterval();
      return;
    }

    if (autoBetsLeft === null) {
      state.plinkoEngine?.dropBall();
      return;
    }

    if (autoBetsLeft > 0) {
      state.plinkoEngine?.dropBall();
      setAutoBetsLeft((prev) => (prev as number) - 1);
    }
    if (autoBetsLeft === 0) {
      resetAutoBetInterval();
    }
  };

  const handleBetClick = () => {
    if (betMode === BetMode.MANUAL) {
      state.plinkoEngine?.dropBall();
    } else if (!autoBetInterval) {
      setAutoBetsLeft(autoBetInput === 0 ? null : autoBetInput);
      setAutoBetInterval(setInterval(autoBetDropBall, autoBetIntervalMs));
    } else {
      resetAutoBetInterval();
    }
  };

  const betModes = [
    { value: BetMode.MANUAL, label: "Manual" },
    { value: BetMode.AUTO, label: "Auto" },
  ];

  const riskLevels = [
    { value: RiskLevel.LOW, label: "Low" },
    { value: RiskLevel.MEDIUM, label: "Medium" },
    { value: RiskLevel.HIGH, label: "High" },
  ];

  return (
    <div className="flex flex-col gap-5 bg-slate-700 p-3 lg:max-w-80">
      {/* Bet Mode Toggle */}
      <div className="flex gap-1 rounded-full bg-slate-900 p-1">
        {betModes.map(({ value, label }) => (
          <button
            key={value}
            disabled={autoBetInterval !== null}
            onClick={() => setBetMode(value)}
            className={`flex-1 rounded-full py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-600 active:[&:not(:disabled)]:bg-slate-500 ${
              betMode === value ? "bg-slate-600" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bet Amount Input */}
      <div className="relative">
        <label
          htmlFor="betAmount"
          className="text-sm font-medium text-slate-300"
        >
          Bet Amount
        </label>
        <div className="flex">
          <div className="relative flex-1">
            <input
              id="betAmount"
              value={state.betAmount}
              onBlur={handleBetAmountFocusOut}
              disabled={autoBetInterval !== null}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              className={`w-full rounded-l-md border-2 border-slate-600 bg-slate-900 py-2 pl-7 pr-2 text-sm text-white transition-colors hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500 ${
                (isBetAmountNegative || isBetExceedBalance) &&
                "border-red-500 focus:border-red-400 hover:[&:not(:disabled)]:border-red-400"
              }`}
            />
            <div
              className="absolute left-3 top-2 select-none text-slate-500"
              aria-hidden="true"
            >
              $
            </div>
          </div>
          <button
            disabled={autoBetInterval !== null}
            onClick={() =>
              setBetAmount(parseFloat((state.betAmount / 2).toFixed(2)))
            }
            className="touch-manipulation bg-slate-600 px-4 font-bold diagonal-fractions text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
          >
            1/2
          </button>
          <button
            disabled={autoBetInterval !== null}
            onClick={() =>
              setBetAmount(parseFloat((state.betAmount * 2).toFixed(2)))
            }
            className="relative touch-manipulation rounded-r-md bg-slate-600 px-4 text-sm font-bold text-white transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-slate-800 after:content-[''] disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-slate-500 active:[&:not(:disabled)]:bg-slate-400"
          >
            2×
          </button>
        </div>
        {isBetAmountNegative && (
          <p className="absolute text-xs leading-5 text-red-400">
            This must be greater than or equal to 0.
          </p>
        )}
        {isBetExceedBalance && (
          <p className="absolute text-xs leading-5 text-red-400">
            Can't bet more than your balance!
          </p>
        )}
      </div>

      {/* Risk Level Select */}
      <div>
        <label
          htmlFor="riskLevel"
          className="text-sm font-medium text-slate-300"
        >
          Risk
        </label>
        <select
          id="riskLevel"
          value={state.riskLevel}
          onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
          disabled={hasOutstandingBalls || autoBetInterval !== null}
          className="w-full rounded-md border-2 border-slate-600 bg-slate-900 p-2 text-sm text-white transition-colors hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500"
        >
          {riskLevels.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Row Count Select */}
      <div>
        <label
          htmlFor="rowCount"
          className="text-sm font-medium text-slate-300"
        >
          Rows
        </label>
        <select
          id="rowCount"
          value={state.rowCount}
          onChange={(e) => setRowCount(parseInt(e.target.value) as RowCount)}
          disabled={hasOutstandingBalls || autoBetInterval !== null}
          className="w-full rounded-md border-2 border-slate-600 bg-slate-900 p-2 text-sm text-white transition-colors hover:cursor-pointer focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-slate-500"
        >
          {rowCountOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleBetClick}
        disabled={isDropBallDisabled}
        className={`touch-manipulation rounded-md bg-green-500 py-3 font-semibold text-slate-900 transition-colors hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400 ${
          autoBetInterval !== null &&
          "bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600"
        }`}
      >
        {betMode === BetMode.MANUAL
          ? "Drop Ball"
          : autoBetInterval === null
          ? "Start Autobet"
          : "Stop Autobet"}
      </button>
    </div>
  );
};

export default Sidebar;
