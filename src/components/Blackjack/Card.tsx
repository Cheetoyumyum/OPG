import { motion } from "framer-motion";
import React from "react";

interface CardProps {
  suit: string;
  value: string;
  hidden?: boolean;
  result?: "win" | "lose" | "push" | "blackjack" | null;
  pairType?: "perfect" | "colored" | "mixed" | null;
  isSmall?: boolean;
  index?: number;
}

const Card: React.FC<CardProps> = ({
  suit,
  value,
  hidden = false,
  result = null,
  pairType = null,
  isSmall = false,
  index = 0,
}) => {
  const getSuitColor = () => {
    return suit === "♥" || suit === "♦" ? "text-red-600" : "text-black";
  };

  const getBorderColor = () => {
    if (pairType) {
      switch (pairType) {
        case "perfect":
          return "border-purple-500";
        case "colored":
          return "border-yellow-500";
        case "mixed":
          return "border-blue-500";
      }
    }

    if (!result) return "border-white/20";
    switch (result) {
      case "win":
      case "blackjack":
        return "border-[#4ADE80]";
      case "lose":
        return "border-red-500";
      case "push":
        return "border-white/50";
      default:
        return "border-white/20";
    }
  };

  const cardSize = isSmall
    ? "w-12 h-20 md:w-24 md:h-36"
    : "w-16 h-24 md:w-28 md:h-40";
  const fontSize = isSmall ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl";

  if (hidden) {
    return (
      <div
        className={`${cardSize} bg-blue-800 rounded-lg border-2 ${getBorderColor()} shadow-lg`}
      >
        <div className="w-full h-full rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-base md:text-lg">♠</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardSize} relative transform-style-3d`}>
      {/* Back of card - always starts visible */}
      <motion.div
        className={`${cardSize} bg-blue-800 rounded-lg border-2 ${getBorderColor()} shadow-lg absolute inset-0 backface-hidden`}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 180 }}
        transition={{
          duration: 0.3,
          delay: 0.5 + index * 0.2, // Start flipping after dealing animation + stagger
        }}
      >
        <div className="w-full h-full rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-base md:text-lg">♠</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Front of card - starts rotated and flips into view */}
      <motion.div
        className={`${cardSize} bg-white rounded-lg border-4 ${getBorderColor()} shadow-lg flex items-center justify-center absolute inset-0 backface-hidden`}
        initial={{ rotateY: -180 }}
        animate={{ rotateY: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.5 + index * 0.2, // Start flipping after dealing animation + stagger
        }}
      >
        <div className={`${fontSize} font-bold ${getSuitColor()}`}>
          {value === "10" ? (
            <div
              className={
                isSmall ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
              }
            >
              {value}
            </div>
          ) : (
            <div>{value}</div>
          )}
          <div
            className={
              isSmall
                ? "text-xl mt-1 md:text-2xl md:mt-1"
                : "text-2xl mt-1 md:text-3xl md:mt-2"
            }
          >
            {suit}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
