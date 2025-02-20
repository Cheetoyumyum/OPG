import React from "react";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import { BlackjackState } from "../../types/blackjack";
import { motion, AnimatePresence } from "framer-motion";

interface GameBoardProps {
  gameState: BlackjackState;
  gameId: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, gameId }) => {
  // Calculate animation timing based on the last card's index
  const getAnimationDelay = (cardCount: number) => {
    const dealingDelay = (cardCount - 1) * 0.2; // Time for dealing animation
    const flipDelay = 0.5; // Initial flip delay
    const flipDuration = 0.6; // Flip animation duration
    const additionalDelay = 0.1; // Small extra delay for visual smoothness
    return dealingDelay + flipDelay + flipDuration + additionalDelay;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Dealer Score */}
      <div className="bg-[#1E2328] rounded-full text-center px-2 md:px-4 py-0.5 md:py-1 mb-2 md:mb-4">
        <AnimatePresence>
          <motion.span
            key={`dealer-score-${gameId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: getAnimationDelay(gameState.dealerHand.length),
            }}
            className="text-white text-base md:text-xl"
          >
            {gameState.dealerScore}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Dealer Cards */}
      <div className="mb-4 md:mb-8">
        <DealerHand
          cards={gameState.dealerHand}
          hideSecondCard={gameState.hideSecondCard}
          gameId={gameId}
        />
      </div>

      {/* Center Info */}
      <div className="flex flex-col items-center gap-0.5 md:gap-1 mb-4 md:mb-8">
        <div className="bg-[#1E2328] px-3 md:px-6 py-0.5 md:py-1 rounded-lg">
          <span className="text-white text-[10px] md:text-sm uppercase tracking-wider">
            Blackjack pays 3 to 2
          </span>
        </div>
        <div className="bg-[#1E2328] px-3 md:px-6 py-0.5 md:py-1 rounded-lg">
          <span className="text-white text-[10px] md:text-sm uppercase tracking-wider">
            Insurance pays 2 to 1
          </span>
        </div>
      </div>

      {/* Player Hands */}
      <div className="flex gap-4 md:gap-12">
        {gameState.playerHands.map((hand, index) => (
          <div
            key={index}
            className={`relative transition-transform duration-300`}
          >
            <PlayerHand
              cards={hand.cards}
              result={hand.result}
              isSmall={gameState.playerHands.length > 1}
              gameId={gameId}
            />
            <div className="flex justify-center mt-1 md:mt-2">
              <div
                className={`min-w-10 md:min-w-14 text-center rounded-full px-2 md:px-4 py-0.5 md:py-1 ${
                  hand.result === "win" || hand.result === "blackjack"
                    ? "bg-[#4ADE80]"
                    : hand.result === "lose"
                    ? "bg-red-500"
                    : "bg-[#1E2328]"
                }`}
              >
                <AnimatePresence>
                  <motion.span
                    key={`player-score-${gameId}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: getAnimationDelay(hand.cards.length) }}
                    className="text-white text-base md:text-xl"
                  >
                    {hand.score}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
