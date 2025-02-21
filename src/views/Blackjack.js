import { useState } from "react";
import BetControls from "../components/Blackjack/BetControls";
import { BlackjackGame } from "../components/Blackjack/BlackjackEngine";
import GameBoard from "../components/Blackjack/GameBoard";
import GameControls from "../components/Blackjack/GameControls";

const Blackjack = () => {
  const [game] = useState(new BlackjackGame());
  const [betAmount, setBetAmount] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [perfectPairsBet, setPerfectPairsBet] = useState(0);
  const [twentyOnePlus3Bet, setTwentyOnePlus3Bet] = useState(0);
  const [gameState, setGameState] = useState({
    playerHands: [
      {
        cards: [],
        score: 0,
        result: null,
        payout: 0,
        pairType: null,
        pairPayout: 0,
        twentyOnePlus3Hand: null,
        twentyOnePlus3Payout: 0,
      },
    ],
    currentHandIndex: 0,
    dealerHand: [],
    dealerScore: 0,
    hideSecondCard: true,
    isGameActive: false,
  });
  const [gameId, setGameId] = useState(0);

  const calculateResult = (playerScore, dealerScore, isBlackjack = false) => {
    if (isBlackjack) {
      return {
        result: "blackjack",
        payout: betAmount * 1.5,
      };
    }

    if (playerScore > 21) {
      return {
        result: "lose",
        payout: 0,
      };
    }

    if (dealerScore > 21) {
      return {
        result: "win",
        payout: betAmount,
      };
    }

    if (playerScore === dealerScore) {
      return {
        result: "push",
        payout: betAmount,
      };
    }

    if (playerScore > dealerScore) {
      return {
        result: "win",
        payout: betAmount,
      };
    }

    return {
      result: "lose",
      payout: 0,
    };
  };

  const startNewGame = () => {
    if (betAmount <= 0) return;

    // Deduct bets from balance
    const totalBet = betAmount + perfectPairsBet + twentyOnePlus3Bet;
    setBalance((prev) => prev - totalBet);
    setGameId((prev) => prev + 1);

    const playerCards = [game.dealCard(), game.dealCard()];
    const dealerCards = [game.dealCard(), game.dealCard()];
    const playerScore = game.calculateHandValue(playerCards);

    const isBlackjack = game.isBlackjack(playerCards);
    const result = isBlackjack ? calculateResult(playerScore, 0, true) : null;

    // Check for Perfect Pairs
    const pairType = game.checkPairType(playerCards);
    const pairPayout = game.calculatePairPayout(pairType, perfectPairsBet);

    // Check for 21+3
    const twentyOnePlus3Hand = game.check21Plus3(playerCards, dealerCards[0]);
    const twentyOnePlus3Payout = game.calculate21Plus3Payout(
      twentyOnePlus3Hand,
      twentyOnePlus3Bet
    );

    // Update balance with side bet payouts
    const totalSidePayout = pairPayout + twentyOnePlus3Payout;
    if (totalSidePayout > 0) {
      setBalance((prev) => prev + totalSidePayout);
    }

    setGameState({
      playerHands: [
        {
          cards: playerCards,
          score: playerScore,
          result: result?.result || null,
          payout: result?.payout || 0,
          pairType,
          pairPayout,
          twentyOnePlus3Hand,
          twentyOnePlus3Payout,
        },
      ],
      currentHandIndex: 0,
      dealerHand: dealerCards,
      dealerScore: game.calculateHandValue([dealerCards[0]]),
      hideSecondCard: true,
      isGameActive: !isBlackjack,
    });
  };

  const handleHit = () => {
    const newCard = game.dealCard();
    const newPlayerHand = [
      ...gameState.playerHands[gameState.currentHandIndex].cards,
      newCard,
    ];
    const newPlayerScore = game.calculateHandValue(newPlayerHand);

    const result =
      newPlayerScore > 21
        ? calculateResult(newPlayerScore, gameState.dealerScore)
        : null;

    setGameState((prev) => ({
      ...prev,
      playerHands: prev.playerHands.map((hand, index) =>
        index === prev.currentHandIndex
          ? {
              ...hand,
              cards: newPlayerHand,
              score: newPlayerScore,
              result: result?.result || null,
              payout: result?.payout || 0,
            }
          : hand
      ),
      isGameActive: newPlayerScore <= 21,
    }));
  };

  const canSplit = () => {
    const currentHand = gameState.playerHands[gameState.currentHandIndex];
    return (
      currentHand.cards.length === 2 &&
      currentHand.cards[0].value === currentHand.cards[1].value &&
      gameState.playerHands.length < 2 &&
      betAmount > 0
    );
  };

  const handleSplit = () => {
    if (!canSplit()) return;

    const currentHand = gameState.playerHands[gameState.currentHandIndex];
    const newHands = [
      {
        cards: [currentHand.cards[0], game.dealCard()],
        score: 0,
        result: null,
        payout: 0,
      },
      {
        cards: [currentHand.cards[1], game.dealCard()],
        score: 0,
        result: null,
        payout: 0,
      },
    ];

    newHands[0].score = game.calculateHandValue(newHands[0].cards);
    newHands[1].score = game.calculateHandValue(newHands[1].cards);

    setGameState((prev) => ({
      ...prev,
      playerHands: newHands,
      currentHandIndex: 0,
    }));
  };

  const handleStand = () => {
    if (gameState.currentHandIndex < gameState.playerHands.length - 1) {
      // Move to next split hand
      setGameState((prev) => ({
        ...prev,
        currentHandIndex: prev.currentHandIndex + 1,
      }));
      return;
    }

    // Final stand - dealer's turn
    let currentDealerHand = [...gameState.dealerHand];
    let currentDealerScore = game.calculateHandValue(currentDealerHand);

    while (currentDealerScore < 17) {
      const newCard = game.dealCard();
      currentDealerHand.push(newCard);
      currentDealerScore = game.calculateHandValue(currentDealerHand);
    }

    // Calculate results for all hands
    const updatedHands = gameState.playerHands.map((hand) => {
      const result = calculateResult(hand.score, currentDealerScore);
      const multiplier = hand.cards.length === 3 ? 2 : 1; // Check if hand was doubled
      return {
        ...hand,
        result: result.result,
        payout: result.payout * multiplier,
      };
    });

    setGameState((prev) => ({
      ...prev,
      playerHands: updatedHands,
      dealerHand: currentDealerHand,
      dealerScore: currentDealerScore,
      isGameActive: false,
      hideSecondCard: false,
    }));
  };

  const canDouble = () => {
    const currentHand = gameState.playerHands[gameState.currentHandIndex];
    return (
      currentHand.cards.length === 2 &&
      !currentHand.result &&
      betAmount > 0 &&
      betAmount <= balance
    );
  };

  const handleDouble = () => {
    if (!canDouble()) return;

    // Deal one more card
    const newCard = game.dealCard();
    const currentHand = gameState.playerHands[gameState.currentHandIndex];
    const newPlayerHand = [...currentHand.cards, newCard];
    const newPlayerScore = game.calculateHandValue(newPlayerHand);

    // Calculate result if bust
    const result =
      newPlayerScore > 21
        ? calculateResult(newPlayerScore, gameState.dealerScore)
        : null;

    // Update state with doubled bet
    setGameState((prev) => ({
      ...prev,
      playerHands: prev.playerHands.map((hand, index) =>
        index === prev.currentHandIndex
          ? {
              ...hand,
              cards: newPlayerHand,
              score: newPlayerScore,
              result: result?.result || null,
              payout: result ? result.payout * 2 : 0, // Double the payout
            }
          : hand
      ),
      isGameActive: newPlayerScore <= 21,
    }));

    // If not bust, automatically stand
    if (newPlayerScore <= 21) {
      handleStand();
    }
  };

  return (
    <div className="flex bg-[#181818] p-4">
      <div className="flex max-w-7xl mx-auto w-full flex-col lg:flex-row gap-0 md:gap-8">
        {/* Left Column - Controls (Desktop) / Bottom Controls (Mobile) */}
        <div className="order-2 lg:order-1 w-full lg:w-[320px] flex flex-col gap-0 md:gap-8">
          <div className="order-2 md:order-1 bg-[#131a22] p-6">
            <BetControls
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              perfectPairsBet={perfectPairsBet}
              setPerfectPairsBet={setPerfectPairsBet}
              twentyOnePlus3Bet={twentyOnePlus3Bet}
              setTwentyOnePlus3Bet={setTwentyOnePlus3Bet}
              isGameActive={gameState.isGameActive}
            />
          </div>
          <div className="order-1 md:order-2 bg-[#131a22] p-6">
            <GameControls
              gameState={gameState}
              onHit={handleHit}
              onStand={handleStand}
              onDouble={handleDouble}
              onSplit={handleSplit}
              betAmount={betAmount}
              onBet={startNewGame}
              isGameActive={gameState.isGameActive}
              canSplit={canSplit()}
              canDouble={canDouble()}
            />
          </div>
        </div>

        {/* Right Column - Game Board (Desktop) / Top Game Board (Mobile) */}
        <div className="order-1 lg:order-2 flex-1 bg-[#131a22] p-6">
          <GameBoard gameState={gameState} gameId={gameId} />
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
