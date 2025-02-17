import React, { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { BetMode, RiskLevel } from "../../types/game";
import {
  RowCount,
  rowCountOptions,
  autoBetIntervalMs,
} from "../../constants/game";
import { FaInfinity, FaGear, FaChartLine, FaQuestion } from "react-icons/fa6";

const ControlPanel: React.FC = () => {
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
    <div className="flex flex-col gap-5 bg-[#131a22] p-5 lg:max-w-80 rounded-xl shadow-2xl">
      {/* Bet Mode Toggle */}
      <div className="flex gap-1 rounded-full bg-[#273f61]/50 p-1">
        {betModes.map(({ value, label }) => (
          <button
            key={value}
            disabled={autoBetInterval !== null}
            onClick={() => setBetMode(value)}
            className={`flex-1 rounded-full py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-[#1ffdb0] hover:[&:not(:disabled)]:text-[#131a22] ${
              betMode === value ? "bg-[#1ffdb0] text-[#131a22]" : ""
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
          className="text-sm font-medium text-[#1ffdb0]"
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
              className={`w-full rounded-l-md border-2 border-[#273f61] bg-[#0f1728] py-2 pl-7 pr-2 text-sm text-white transition-colors hover:cursor-pointer focus:border-[#1ffdb0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:border-[#1ffdb0] ${
                (isBetAmountNegative || isBetExceedBalance) &&
                "border-red-500 focus:border-red-400 hover:[&:not(:disabled)]:border-red-400"
              }`}
            />
            <div
              className="absolute left-3 top-2 select-none text-[#1ffdb0]"
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
            className="touch-manipulation bg-[#273f61] px-4 font-bold diagonal-fractions text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-[#1ffdb0] hover:[&:not(:disabled)]:text-[#131a22]"
          >
            1/2
          </button>
          <button
            disabled={autoBetInterval !== null}
            onClick={() =>
              setBetAmount(parseFloat((state.betAmount * 2).toFixed(2)))
            }
            className="relative touch-manipulation rounded-r-md bg-[#273f61] px-4 text-sm font-bold text-white transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-[#0f1728] after:content-[''] disabled:cursor-not-allowed disabled:opacity-50 hover:[&:not(:disabled)]:bg-[#1ffdb0] hover:[&:not(:disabled)]:text-[#131a22]"
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

      {/* Risk Level */}
      <div className="space-y-2">
        <label className="text-base text-white">Risk</label>
        <div className="grid grid-cols-3 gap-2">
          {riskLevels.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setRiskLevel(value)}
              disabled={hasOutstandingBalls || autoBetInterval !== null}
              className={`rounded-lg py-3 text-base transition-colors ${
                state.riskLevel === value
                  ? "bg-[#1ffdb0] text-[#131a22]"
                  : "bg-[#0f1728] text-white hover:bg-[#1ffdb0] hover:text-[#131a22]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        <label className="text-base text-white">Rows</label>
        <div className="text-start text-base text-white">{state.rowCount}</div>
        <input
          type="range"
          min="8"
          max="16"
          value={state.rowCount}
          onChange={(e) => setRowCount(parseInt(e.target.value) as RowCount)}
          disabled={hasOutstandingBalls || autoBetInterval !== null}
          className="w-full cursor-pointer rounded-lg bg-[#0f1728] accent-[#1ffdb0]"
        />
      </div>

      {betMode === BetMode.AUTO && (
        <div className="space-y-2">
          <label className="text-base text-white">Number of Bets</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={autoBetInput}
              onChange={(e) => setAutoBetInput(Number(e.target.value))}
              min="0"
              className="flex-1 rounded-lg bg-[#0f1728] py-3 px-4 text-lg text-white"
            />
            <button className="rounded-lg bg-[#273f61] p-3">
              <FaInfinity className="text-xl text-white" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleBetClick}
        disabled={isDropBallDisabled}
        className={`touch-manipulation rounded-md py-3 font-semibold transition-colors ${
          autoBetInterval !== null
            ? "bg-[#1ffdb0] text-[#131a22] hover:bg-[#1ae69f] active:bg-[#1cd894]"
            : "bg-[#1ffdb0] text-[#131a22] hover:bg-[#1ae69f] active:bg-[#1cd894] disabled:bg-neutral-600 disabled:text-neutral-400"
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

export default ControlPanel;
