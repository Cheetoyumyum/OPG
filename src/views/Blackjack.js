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
  const [insuranceBet, setInsuranceBet] = useState(0);
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
    isSplit: false,
    showInsurance: false,
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

    // Reset insurance bet
    setInsuranceBet(0);

    // Deduct bets from balance
    const totalBet = betAmount + perfectPairsBet + twentyOnePlus3Bet;
    setBalance((prev) => prev - totalBet);
    setGameId((prev) => prev + 1);

    const playerCards = [game.dealCard(), game.dealCard()];
    const dealerCards = [game.dealCard(), game.dealCard()];
    const playerScore = game.calculateHandValue(playerCards);

    // Check if dealer's up card is an Ace
    const showInsurance = dealerCards[0].value === "A";

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
      showInsurance,
    });
  };

  const handleHit = () => {
    const newCard = game.dealCard();
    const currentHandIndex = gameState.currentHandIndex;
    const currentHand = gameState.playerHands[currentHandIndex];
    const newPlayerHand = [...currentHand.cards, newCard];
    const newPlayerScore = game.calculateHandValue(newPlayerHand);

    // Calculate result for the new score
    const result =
      newPlayerScore > 21
        ? calculateResult(newPlayerScore, gameState.dealerScore)
        : null;

    setGameState((prev) => {
      const updatedHands = prev.playerHands.map((hand, index) =>
        index === currentHandIndex
          ? {
              ...hand,
              cards: newPlayerHand,
              score: newPlayerScore,
              result: result?.result || null,
              payout: result?.payout || 0,
            }
          : hand
      );

      // Check if the player has busted
      if (newPlayerScore > 21) {
        // Move to the next hand if available
        if (currentHandIndex < updatedHands.length - 1) {
          return {
            ...prev,
            playerHands: updatedHands,
            currentHandIndex: currentHandIndex + 1,
            isGameActive: true, // Game is still active
          };
        } else {
          // End game if all hands are done
          return {
            ...prev,
            playerHands: updatedHands,
            isGameActive: false,
          };
        }
      }

      // Check for automatic stand on 21
      if (newPlayerScore === 21) {
        // Automatically stand and move to the next hand
        if (currentHandIndex < updatedHands.length - 1) {
          handleStand();
          return {
            ...prev,
            currentHandIndex: currentHandIndex + 1, // Move to the next hand
          };
        }
      }

      return {
        ...prev,
        playerHands: updatedHands,
        isGameActive: newPlayerScore <= 21,
      };
    });
  };

  const canSplit = () => {
    const currentHand = gameState.playerHands[gameState.currentHandIndex];
    const cardValues = currentHand.cards.map((card) => card.value);

    const isTenValueCards = cardValues.every(
      (value) =>
        value === "10" || value === "J" || value === "Q" || value === "K"
    );

    return (
      currentHand.cards.length === 2 &&
      (currentHand.cards[0].value === currentHand.cards[1].value ||
        isTenValueCards) &&
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
        pairType: null,
        pairPayout: 0,
        twentyOnePlus3Hand: null,
        twentyOnePlus3Payout: 0,
      },
      {
        cards: [currentHand.cards[1], game.dealCard()],
        score: 0,
        result: null,
        payout: 0,
        pairType: null,
        pairPayout: 0,
        twentyOnePlus3Hand: null,
        twentyOnePlus3Payout: 0,
      },
    ];

    newHands[0].score = game.calculateHandValue(newHands[0].cards);
    newHands[1].score = game.calculateHandValue(newHands[1].cards);

    // Check for new pairs in the split hands
    newHands[0].pairType = game.checkPairType(newHands[0].cards);
    newHands[0].pairPayout = game.calculatePairPayout(
      newHands[0].pairType,
      perfectPairsBet
    );

    newHands[1].pairType = game.checkPairType(newHands[1].cards);
    newHands[1].pairPayout = game.calculatePairPayout(
      newHands[1].pairType,
      perfectPairsBet
    );

    // Update balance with any new pair payouts
    const totalNewPairPayout = newHands[0].pairPayout + newHands[1].pairPayout;
    if (totalNewPairPayout > 0) {
      setBalance((prev) => prev + totalNewPairPayout);
    }

    setGameState((prev) => ({
      ...prev,
      playerHands: newHands,
      currentHandIndex: 0,
      isSplit: true,
    }));
  };

  const handleStand = () => {
    // If there are multiple hands, check if we need to move to the next hand
    if (gameState.currentHandIndex < gameState.playerHands.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentHandIndex: prev.currentHandIndex + 1, // Move to the next hand
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
        ...hand, // Preserve all existing properties including side bet results
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

    // Deduct additional bet amount from balance
    setBalance((prev) => prev - betAmount);

    // Deal one more card
    const newCard = game.dealCard();
    const currentHand = gameState.playerHands[gameState.currentHandIndex];
    const newPlayerHand = [...currentHand.cards, newCard];
    const newPlayerScore = game.calculateHandValue(newPlayerHand);

    // Update state first
    setGameState((prev) => ({
      ...prev,
      playerHands: prev.playerHands.map((hand, index) =>
        index === prev.currentHandIndex
          ? {
              ...hand, // Preserve all existing properties including side bet results
              cards: newPlayerHand,
              score: newPlayerScore,
            }
          : hand
      ),
      isGameActive: true, // Keep game active until we process dealer's turn
    }));

    // If not bust, handle dealer's turn
    if (newPlayerScore <= 21) {
      // Use setTimeout to ensure state update has completed
      setTimeout(() => {
        handleStand();
      }, 100);
    } else {
      // If bust, calculate result immediately
      const result = calculateResult(newPlayerScore, gameState.dealerScore);
      setGameState((prev) => ({
        ...prev,
        playerHands: prev.playerHands.map((hand, index) =>
          index === prev.currentHandIndex
            ? {
                ...hand, // Preserve all existing properties including side bet results
                result: result.result,
                payout: result.payout * 2, // Double the payout since it was a double down
              }
            : hand
        ),
        isGameActive: false,
      }));
    }
  };

  const handleInsurance = () => {
    const insuranceAmount = betAmount / 2;
    setInsuranceBet(insuranceAmount);
    setBalance((prev) => prev - insuranceAmount);

    // Check if dealer has blackjack (natural 21 with just 2 cards)
    const dealerHasBlackjack = game.isBlackjack(gameState.dealerHand);

    if (dealerHasBlackjack) {
      // Insurance pays 2:1
      const insurancePayout = insuranceAmount * 2;
      setBalance((prev) => prev + insurancePayout);
    }

    setGameState((prev) => ({
      ...prev,
      showInsurance: false,
      hideSecondCard: false,
      isGameActive: !dealerHasBlackjack,
    }));
  };

  const declineInsurance = () => {
    setGameState((prev) => ({
      ...prev,
      showInsurance: false,
    }));
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
              onInsurance={handleInsurance}
              onDeclineInsurance={declineInsurance}
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
          <GameBoard
            gameState={gameState}
            gameId={gameId}
            insuranceBet={insuranceBet}
          />
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
