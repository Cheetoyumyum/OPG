import React from "react";
import Card from "./Card";
import { motion } from "framer-motion";

interface DealerHandProps {
  cards: Array<{
    suit: string;
    value: string;
  }>;
  hideSecondCard?: boolean;
  gameId: number;
}

const DealerHand: React.FC<DealerHandProps> = ({
  cards,
  hideSecondCard = true,
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
            hidden={hideSecondCard && index === 1}
            index={index}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DealerHand;
