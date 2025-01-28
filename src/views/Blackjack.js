import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const Blackjack = () => {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [splitHand, setSplitHand] = useState(null);
  const [bet, setBet] = useState(0);
  const [sideBets, setSideBets] = useState({ perfectPairs: 0, twentyOnePlusThree: 0 });
  const [gameStatus, setGameStatus] = useState("");
  const [playerTurn, setPlayerTurn] = useState(true);
  const [deck, setDeck] = useState([]);

  const initializeDeck = () => {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const cards = suits.flatMap(suit => Array.from({ length: 13 }, (_, i) => ({ suit, value: i + 1 })));
    setDeck(cards.sort(() => Math.random() - 0.5));
  };

  const calculateHandValue = (hand) => {
    let value = hand.reduce((sum, card) => sum + Math.min(card.value, 10), 0);
    const hasAce = hand.some(card => card.value === 1);
    if (hasAce && value + 10 <= 21) value += 10;
    return value;
  };

  const dealInitialCards = () => {
    initializeDeck();
    const newDeck = [...deck];
    setPlayerHand([newDeck.pop(), newDeck.pop()]);
    setDealerHand([newDeck.pop(), newDeck.pop()]);
    setGameStatus("");
    setPlayerTurn(true);
    setDeck(newDeck);
    checkSideBets();
  };

  const checkSideBets = () => {
    if (playerHand.length < 2) return;
  
    const [card1, card2] = playerHand;
    if (card1.value === card2.value && card1.suit === card2.suit) {
      setSideBets(prev => ({ ...prev, perfectPairs: bet * 25 }));
    }
  
    const sortedHand = [card1, card2].sort((a, b) => a.value - b.value);
    if (
      sortedHand[0].value + 1 === sortedHand[1].value &&
      (sortedHand[0].suit === sortedHand[1].suit || sortedHand[0].value === 1)
    ) {
      setSideBets(prev => ({ ...prev, twentyOnePlusThree: bet * 5 }));
    }
  };

  const hit = () => {
    if (!playerTurn) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    setPlayerHand([...playerHand, newCard]);
    setDeck(newDeck);
    if (calculateHandValue([...playerHand, newCard]) > 21) {
      setGameStatus("Bust! Dealer Wins.");
      setPlayerTurn(false);
    }
  };

  const stand = () => {
    setPlayerTurn(false);
    dealerPlay();
  };

  const doubleDown = () => {
    if (playerTurn && playerHand.length === 2) {
      setBet(bet * 2);
      hit();
      if (gameStatus === "") stand();
    }
  };

  const split = () => {
    if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
      setSplitHand([playerHand.pop()]);
    }
  };

  const dealerPlay = () => {
    let dealerValue = calculateHandValue(dealerHand);
    const newDeck = [...deck];
    while (dealerValue < 17) {
      dealerHand.push(newDeck.pop());
      dealerValue = calculateHandValue(dealerHand);
    }
    setDeck(newDeck);
    determineWinner();
  };

  const determineWinner = () => {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);
    if (dealerValue > 21 || playerValue > dealerValue) {
      setGameStatus(`Player Wins! Winnings: $${bet + sideBets.perfectPairs + sideBets.twentyOnePlusThree}`);
    } else if (playerValue < dealerValue) {
      setGameStatus("Dealer Wins!");
    } else {
      setGameStatus("Push (Tie).");
    }
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setSplitHand(null);
    setBet(0);
    setSideBets({ perfectPairs: 0, twentyOnePlusThree: 0 });
    setGameStatus("");
    setPlayerTurn(true);
    initializeDeck();
  };

  const CustomButton = ({ onClick, children, className, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded text-white ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center p-4">
      <div className="text-white text-3xl font-bold mb-4">Blackjack Game</div>
      <div className="flex space-x-8">
        <div className="bg-gray-800 p-4 rounded-lg w-1/4 text-white">
          <div className="mb-4">
            <label className="block mb-2">Enter Bet:</label>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Perfect Pair Bet:</label>
            <input
              type="number"
              value={sideBets?.perfectPairs || 0}
              onChange={(e) => setSideBets(prev => ({ ...prev, perfectPairs: Number(e.target.value) }))}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">21+3 Bet:</label>
            <input
              type="number"
              value={sideBets?.twentyOnePlusThree || 0}
              onChange={(e) => setSideBets(prev => ({ ...prev, twentyOnePlusThree: Number(e.target.value) }))}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <CustomButton
            onClick={dealInitialCards}
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            Deal Cards
          </CustomButton>
        </div>
        <div className="flex-1 bg-gray-900 p-4 rounded-lg">
          <div className="mb-4">
            <div className="text-white text-lg">Dealer's Hand</div>
            <div className="text-white">
              {dealerHand.map((card, index) => (
                <span key={index}>
                  {index === 0 || !playerTurn
                    ? `${card.value} of ${card.suit}`
                    : "[Hidden]"},
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-white text-lg">Player's Hand</div>
            <div className="text-white">
              {playerHand.map((card, index) => (
                <span key={index}>
                  {card.value} of {card.suit},
                </span>
              ))}
            </div>
            <div className="text-green-400 text-xl mt-2">
              Hand Value: {calculateHandValue(playerHand)}
            </div>
          </div>
        </div>
        <div className="w-1/4 bg-gray-800 p-4 rounded-lg">
          <CustomButton
            onClick={hit}
            disabled={!playerTurn}
            className="w-full mb-2 bg-gray-600 hover:bg-gray-700"
          >
            Hit
          </CustomButton>
          <CustomButton
            onClick={stand}
            disabled={!playerTurn}
            className="w-full mb-2 bg-gray-600 hover:bg-gray-700"
          >
            Stand
          </CustomButton>
          <CustomButton
            onClick={doubleDown}
            disabled={!playerTurn || playerHand.length !== 2}
            className="w-full mb-2 bg-gray-600 hover:bg-gray-700"
          >
            Double Down
          </CustomButton>
          <CustomButton
            onClick={split}
            disabled={!playerTurn || playerHand[0]?.value !== playerHand[1]?.value}
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            Split
          </CustomButton>
          <div className="mt-4 text-white">{gameStatus}</div>
          <CustomButton
            onClick={resetGame}
            className="mt-4 w-full bg-red-600 hover:bg-red-700"
          >
            Reset Game
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
