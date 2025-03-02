import React from "react";
import Card from "./Card";
import { motion } from "framer-motion";
import { PairType, ThreeCardPokerHand } from "../../types/blackjack";

interface PlayerHandProps {
  cards: Array<{
    suit: string;
    value: string;
  }>;
  result?: "win" | "lose" | "push" | "blackjack" | null;
  pairType?: PairType;
  pairPayout?: number;
  twentyOnePlus3Hand?: ThreeCardPokerHand;
  twentyOnePlus3Payout?: number;
  isSmall?: boolean;
  gameId: number;
  isActive?: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  result,
  pairType,
  pairPayout,
  twentyOnePlus3Hand,
  twentyOnePlus3Payout,
  isSmall = false,
  gameId,
  isActive = false,
}) => {
  // Keep these functions in case they're needed elsewhere
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

  const get21Plus3Text = () => {
    if (!twentyOnePlus3Hand) return null;
    switch (twentyOnePlus3Hand) {
      case "suited-trips":
        return "Suited Three of a Kind! (100:1)";
      case "straight-flush":
        return "Straight Flush! (40:1)";
      case "three-of-a-kind":
        return "Three of a Kind! (30:1)";
      case "straight":
        return "Straight! (10:1)";
      case "flush":
        return "Flush! (5:1)";
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
    </div>
  );
};

export default PlayerHand;
