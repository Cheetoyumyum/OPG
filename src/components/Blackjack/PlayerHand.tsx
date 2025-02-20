import React from "react";
import Card from "./Card";
import { motion } from "framer-motion";

interface PlayerHandProps {
  cards: Array<{
    suit: string;
    value: string;
  }>;
  result?: "win" | "lose" | "push" | "blackjack" | null;
  isSmall?: boolean;
  gameId: number;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  result,
  isSmall = false,
  gameId,
}) => {
  return (
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
            isSmall={isSmall}
            index={index}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerHand;
