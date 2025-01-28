import React, { useState, useEffect } from "react";
// I have zero fucking idea what im doing here... l0l
const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const generateDeck = () => suits.flatMap((suit) =>
  ranks.map((rank) => ({
    suit,
    rank,
    value: rank === "A" ? 11 : rank.match(/[JQK]/) ? 10 : parseInt(rank),
  }))
);

const shuffleDeck = (deck) => [...deck].sort(() => Math.random() - 0.5);

const calculateHandValue = (hand) => {
  let value = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter((card) => card.rank === "A").length;

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};

const Blackjack = () => {
  const [deck, setDeck] = useState(shuffleDeck(generateDeck()));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [bet, setBet] = useState(0);
  const [sideBets, setSideBets] = useState({ perfectPairs: 0, twentyOnePlusThree: 0 });
  const [gameState, setGameState] = useState("betting");
  const [gameMessage, setGameMessage] = useState("");
  const [dealerRevealed, setDealerRevealed] = useState(false);

  const dealInitialCards = () => {
    setPlayerHand([deck.pop(), deck.pop()]);
    setDealerHand([deck.pop(), deck.pop()]);
    setGameState("playing");
    setGameMessage("Dealing cards...");

    setTimeout(() => {
      setGameMessage("Player's Turn");
    }, 1500);
  };

  const hit = () => {
    const newHand = [...playerHand, deck.pop()];
    setPlayerHand(newHand);

    if (calculateHandValue(newHand) > 21) {
      setGameMessage("Player Busts! You Lose.");
      setGameState("bust");
    } else {
      setGameMessage("Player Hits");
    }
  };

  const stand = async () => {
    setGameMessage("Player Stands");
    let dealerValue = calculateHandValue(dealerHand);
    const newDealerHand = [...dealerHand];
    setDealerRevealed(true);  // Reveal the dealer's second card

    while (dealerValue < 17) {
      setGameMessage("Dealer Hits");
      newDealerHand.push(deck.pop());
      dealerValue = calculateHandValue(newDealerHand);
      setDealerHand(newDealerHand);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setDealerHand(newDealerHand);
    setGameMessage("Dealer Stands");

    setTimeout(() => {
      setGameState("result");
    }, 1000);
  };

  const double = async () => {
    const newHand = [...playerHand, deck.pop()];
    setPlayerHand(newHand);
    setBet(bet * 2);

    if (calculateHandValue(newHand) > 21) {
      setGameMessage("Player Busts! You Lose.");
      setGameState("bust");
    } else {
      setGameMessage("Player Doubles");
      await stand();
    }
  };

  const split = () => {
    if (playerHand.length === 2 && playerHand[0].rank === playerHand[1].rank) {
      const newDeck = [...deck];
      const newPlayerHand1 = [playerHand[0], newDeck.pop()];
      const newPlayerHand2 = [playerHand[1], newDeck.pop()];
      setPlayerHand(newPlayerHand1);
      setDeck(newDeck);
      setGameState("playing");
      setGameMessage("Player Splits");
    }
  };

  const nextRound = () => {
    setDeck(shuffleDeck(generateDeck()));
    setPlayerHand([]);
    setDealerHand([]);
    setSideBets({ perfectPairs: 0, twentyOnePlusThree: 0 });
    setGameState("betting");
    setGameMessage("");
    setDealerRevealed(false);  // Hide dealer's second card for next round
  };

  const handleBetPlacement = (amount) => {
    setBet(amount);
  };

  const handleSideBetPlacement = (sideBet, amount) => {
    setSideBets({ ...sideBets, [sideBet]: amount });
  };

  const getResult = () => {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (playerValue > 21) return "bust";
    if (playerValue === dealerValue) return "push";
    if (playerValue > dealerValue && playerValue <= 21) return "win";
    return "lose";
  };

  useEffect(() => {
    if (gameState === "result") {
      const result = getResult();
      setGameMessage(result === "win" ? "You Win!" : result === "lose" ? "You Lose!" : "Push!");
    }
  }, [gameState]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 py-8">
      <div className="flex w-full max-w-4xl bg-gray-800 rounded-xl p-6">
        <div className="betbar w-1/3 p-4 bg-gray-800 rounded-lg mr-4">
          <h2 className="text-3xl font-bold text-center text-gradient">Blackjack</h2>

          {gameState === "betting" && (
            <div className="mt-6">
              <p className="text-lg mb-4">Place your main bet:</p>
              <input
                type="number"
                className="p-2 mb-4 rounded-lg bg-gray-600 text-white"
                value={bet}
                onChange={(e) => setBet(e.target.value)}
                placeholder="Enter Bet Amount"
              />

              <p className="text-lg mb-4">Place side bets:</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <input
                    type="number"
                    className="p-2 mb-4 rounded-lg bg-gray-600 text-white w-20"
                    value={sideBets.perfectPairs}
                    onChange={(e) => handleSideBetPlacement("perfectPairs", e.target.value)}
                    placeholder="Perfect Pairs"
                  />
                  <span className="ml-2 text-white">Perfect Pairs</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    className="p-2 mb-4 rounded-lg bg-gray-600 text-white w-20"
                    value={sideBets.twentyOnePlusThree}
                    onChange={(e) => handleSideBetPlacement("twentyOnePlusThree", e.target.value)}
                    placeholder="21+3"
                  />
                  <span className="ml-2 text-white">21+3</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between gap-4">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-xl transition"
                  onClick={dealInitialCards}
                >
                  Deal
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="game w-2/3 p-4 rounded-lg">
          {gameState === "playing" && (
            <div className="mt-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-xl">Player Hand: {calculateHandValue(playerHand)}</p>
                  <div className="flex gap-2">
                    {playerHand.map((card, idx) => (
                      <div key={idx} className="w-16 h-24 bg-white text-center rounded shadow-lg flex items-center justify-center">
                        <p>{card.rank} of {card.suit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl">Dealer Hand: {calculateHandValue(dealerHand)}</p>
                  <div className="flex gap-2">
                    <div className="w-16 h-24 bg-white text-center rounded shadow-lg flex items-center justify-center">
                      <p>{dealerHand[0].rank} of {dealerHand[0].suit}</p>
                    </div>
                    {dealerRevealed && (
                      <div className="w-16 h-24 bg-white text-center rounded shadow-lg flex items-center justify-center">
                        <p>{dealerHand[1].rank} of {dealerHand[1].suit}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={hit}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg shadow-md hover:shadow-xl transition"
                  >
                    Hit
                  </button>

                  <button
                    onClick={stand}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-md hover:shadow-xl transition"
                  >
                    Stand
                  </button>

                  <button
                    onClick={double}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow-md hover:shadow-xl transition"
                  >
                    Double
                  </button>

                  <button
                    onClick={split}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-xl transition"
                  >
                    Split
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xl">{gameMessage}</p>
          </div>

          {(gameState === "result" || gameState === "bust") && (
            <button
              className="mt-6 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg shadow-md hover:shadow-xl transition"
              onClick={nextRound}
            >
              Next Round
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
