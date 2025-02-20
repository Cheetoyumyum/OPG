import React from "react";

interface BetControlsProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  isGameActive: boolean;
}

const BetControls: React.FC<BetControlsProps> = ({
  betAmount,
  setBetAmount,
  isGameActive,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input to clear the field
    if (value === "") {
      setBetAmount(0);
      return;
    }
    // Convert to number and validate
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setBetAmount(numValue);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Bet Type Selector */}
      <div className="flex rounded-lg bg-[#1E2328] p-1">
        <button className="flex-1 rounded bg-[#273f61] py-2 text-white">
          Standard
        </button>
        <button className="flex-1 py-2 text-gray-400">Side bet</button>
      </div>

      {/* Bet Amount Input */}
      <div>
        <label className="text-white mb-2 block">Bet Amount</label>
        <div className="flex">
          <div className="relative flex-1">
            <input
              type="number"
              value={betAmount || ""} // Handle 0 as empty string
              onChange={handleInputChange}
              disabled={isGameActive}
              className="w-full rounded-l-md border-2 border-[#273f61] bg-[#1E2328] py-2 pl-7 pr-2 text-white transition-colors focus:border-[#1ffdb0] focus:outline-none disabled:opacity-50"
              min="0"
              step="any"
              placeholder="0.00"
            />
            <div className="absolute left-3 top-2 select-none text-gray-400">
              $
            </div>
          </div>
          <button
            onClick={() => setBetAmount(betAmount / 2)}
            disabled={isGameActive}
            className="bg-[#1E2328] px-4 font-bold text-white border-y-2 border-[#273f61]"
          >
            ½
          </button>
          <button
            onClick={() => setBetAmount(betAmount * 2)}
            disabled={isGameActive}
            className="rounded-r-md bg-[#1E2328] px-4 text-sm font-bold text-white border-2 border-l-0 border-[#273f61]"
          >
            2×
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetControls;
