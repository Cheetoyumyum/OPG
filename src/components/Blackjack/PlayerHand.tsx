import React from "react";
import Card from "./Card";
import { motion } from "framer-motion";

interface PlayerHandProps {
  cards: Array<{
    suit: string;
    value: string;
  }>;
  result?: "win" | "lose" | "push" | "blackjack" | null;
  pairType?: "perfect" | "colored" | "mixed" | null;
  pairPayout?: number;
  isSmall?: boolean;
  gameId: number;
  isActive?: boolean; // Add isActive prop
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  result,
  pairType,
  pairPayout,
  isSmall = false,
  gameId,
  isActive = false, // Default to false
}) => {
  const getPairTypeText = () => {
    if (!pairType) return null;
    switch (pairType) {
      case "perfect":
        return "Perfect Pair! (25:1)";
      case "colored":
        return "Colored Pair! (12:1)";
      case "mixed":
        return "Mixed Pair! (6:1)";
      default:
        return null;
    }
  };

  return (
    <div className={"relative"}>
      {/* Active Hand Indicator */}
      {isActive && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="text-teal-300 text-3xl">▼</div>
        </div>
      )}

      <div className="flex justify-center gap-2">
        {cards.map((card, index) => (
          <motion.div
            key={`${gameId}-${index}`}
            initial={{
              x: 0,
              y: 0,
              rotate: 30,
              opacity: 0,
            }}
            animate={{
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              delay: index * 0.2,
              duration: 0.5,
            }}
          >
            <Card
              suit={card.suit}
              value={card.value}
              result={result}
              pairType={pairType}
              isSmall={isSmall}
              index={index}
            />
          </motion.div>
        ))}
      </div>

      {/* Pair Result Display */}
      {pairType && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="bg-[#1E2328] px-3 py-1 rounded-full text-sm">
            <span className="text-white">{getPairTypeText()}</span>
            {pairPayout && pairPayout > 0 && (
              <span className="text-green-400 ml-2">
                +{pairPayout.toFixed(8)} Ł
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
