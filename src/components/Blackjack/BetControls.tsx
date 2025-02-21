import React, { useState } from "react";

interface BetControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  perfectPairsBet: number;
  setPerfectPairsBet: (amount: number) => void;
  twentyOnePlus3Bet: number;
  setTwentyOnePlus3Bet: (amount: number) => void;
  isGameActive: boolean;
}

const BetControls: React.FC<BetControlsProps> = ({
  betAmount,
  setBetAmount,
  perfectPairsBet,
  setPerfectPairsBet,
  twentyOnePlus3Bet,
  setTwentyOnePlus3Bet,
  isGameActive,
}) => {
  const [activeBetType, setActiveBetType] = useState<"standard" | "side">(
    "standard"
  );

  const handleInputChange =
    (setter: (value: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        setter(0);
        return;
      }
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setter(numValue);
      }
    };

  const BetInput = ({
    value,
    onChange,
    label,
    disabled = false,
  }: {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    disabled?: boolean;
  }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label className="text-white">{label}</label>
        <span className="text-gray-400">0.00 USD</span>
      </div>
      <div className="flex">
        <div className="relative flex-1">
          <div className="absolute left-3 top-2 select-none text-gray-400">
            Ł
          </div>
          <input
            type="number"
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            className="w-full rounded-l-md border-2 border-[#273f61] bg-[#1E2328] py-2 pl-7 pr-2 text-white transition-colors focus:border-[#1ffdb0] focus:outline-none disabled:opacity-50"
            min="0"
            step="any"
            placeholder="0.00000000"
          />
        </div>
        <button
          onClick={() =>
            onChange({ target: { value: String(value / 2) } } as any)
          }
          disabled={disabled}
          className="bg-[#1E2328] px-4 font-bold text-white border-y-2 border-[#273f61]"
        >
          ½
        </button>
        <button
          onClick={() =>
            onChange({ target: { value: String(value * 2) } } as any)
          }
          disabled={disabled}
          className="rounded-r-md bg-[#1E2328] px-4 text-sm font-bold text-white border-2 border-l-0 border-[#273f61]"
        >
          2×
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Bet Type Selector */}
      <div className="flex rounded-lg bg-[#1E2328] p-1 mb-4">
        <button
          onClick={() => setActiveBetType("standard")}
          className={`flex-1 rounded py-2 ${
            activeBetType === "standard"
              ? "bg-[#273f61] text-white"
              : "text-gray-400"
          }`}
        >
          Standard
        </button>
        <button
          onClick={() => setActiveBetType("side")}
          className={`flex-1 rounded py-2 ${
            activeBetType === "side"
              ? "bg-[#273f61] text-white"
              : "text-gray-400"
          }`}
        >
          Side bet
        </button>
      </div>

      {activeBetType === "standard" ? (
        <BetInput
          value={betAmount}
          onChange={handleInputChange(setBetAmount)}
          label="Bet Amount"
          disabled={isGameActive}
        />
      ) : (
        <>
          <BetInput
            value={perfectPairsBet}
            onChange={handleInputChange(setPerfectPairsBet)}
            label="Side Bet (Perfect Pairs)"
            disabled={isGameActive}
          />
          <BetInput
            value={twentyOnePlus3Bet}
            onChange={handleInputChange(setTwentyOnePlus3Bet)}
            label="Side Bet (21 + 3)"
            disabled={isGameActive}
          />
        </>
      )}
    </div>
  );
};

export default BetControls;
