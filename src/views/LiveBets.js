import React from "react";

const LiveBets = ({ filter, setFilter }) => {
  const generateRandomBet = () => {
    const games = ["Blackjack", "Limbo", "Plinko", "Roulette", "Crash", "Dice"];
    const players = ["John", "Jane", "Tom", "Alice", "Bob", "Eve"];
    const betAmount = [10, 20, 50, 100, 200];
    const multipliers = [1.5, 2, 3, 5, 10];
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return {
      game: getRandomElement(games),
      player: getRandomElement(players),
      time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60)} ${Math.random() > 0.5 ? "AM" : "PM"}`,
      bet: getRandomElement(betAmount),
      multiplier: getRandomElement(multipliers),
      payout: (getRandomElement(betAmount) * getRandomElement(multipliers)).toFixed(2),
    };
  };

  const liveBets = Array.from({ length: 10 }, () => generateRandomBet());

  const filteredBets = liveBets.filter(bet => {
    if (filter === "High Rollers") return bet.bet >= 100;
    if (filter === "My Bets") return bet.player === "John";
    return true;
  });

  return (
    <div className="live-bets">
      <div className="filters">
        <button onClick={() => setFilter("All Bets")}>All Bets</button>
        <button onClick={() => setFilter("High Rollers")}>High Rollers</button>
        <button onClick={() => setFilter("My Bets")}>My Bets</button>
      </div>
      <div className="bet-list">
        {filteredBets.map((bet, index) => (
          <div className="bet-item" key={index}>
            <span>{bet.game}</span>
            <span>{bet.player}</span>
            <span>{bet.time}</span>
            <span>{bet.bet} M</span>
            <span>{bet.multiplier}x</span>
            <span>{bet.payout} M</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveBets;
