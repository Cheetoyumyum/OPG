import React, { useState, useEffect } from 'react';

const LiveBets = ({ filter, setFilter }) => {
  const [liveBets, setLiveBets] = useState([]);

  const generateRandomBet = () => {
    const games = ['Blackjack', 'Limbo', 'Plinko', 'Roulette', 'Crash', 'Dice'];
    const players = ['John', 'Jane', 'Tom', 'Alice', 'Bob', 'Eve'];
    const betAmount = [10, 20, 50, 100, 200];
    const multipliers = [1.5, 2, 3, 5, 10];
    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    return {
      game: getRandomElement(games),
      player: getRandomElement(players),
      time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(
        Math.random() * 60
      )} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      bet: getRandomElement(betAmount),
      multiplier: getRandomElement(multipliers),
      payout: (
        getRandomElement(betAmount) * getRandomElement(multipliers)
      ).toFixed(2),
    };
  };

  // Initialize bets
  useEffect(() => {
    setLiveBets(Array.from({ length: 10 }, () => generateRandomBet()));
  }, []);

  // Update bets periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBets((prevBets) => {
        const newBet = generateRandomBet();
        return [newBet, ...prevBets.slice(0, -1)];
      });
    }, 2000); // Updates every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredBets = liveBets.filter((bet) => {
    if (filter === 'High Rollers') return bet.bet >= 100;
    if (filter === 'My Bets') return bet.player === 'John';
    return true;
  });

  return (
    <div className='p-6 bg-[#131a22] rounded-xl shadow-2xl'>
      <div className='filters mb-6 flex gap-3 justify-center'>
        <button
          onClick={() => setFilter('All Bets')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            filter === 'All Bets'
              ? 'bg-[#1ffdb0] text-[#121212] shadow-lg shadow-[#1ffdb0]/20'
              : 'bg-[#273f61]/25 text-white hover:bg-[#1ffdb0] hover:text-[#121212] hover:shadow-lg hover:shadow-[#1ffdb0]/20'
          }`}
        >
          All Bets
        </button>
        <button
          onClick={() => setFilter('High Rollers')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            filter === 'High Rollers'
              ? 'bg-[#1ffdb0] text-[#121212] shadow-lg shadow-[#1ffdb0]/20'
              : 'bg-[#273f61]/25 text-white hover:bg-[#1ffdb0] hover:text-[#121212] hover:shadow-lg hover:shadow-[#1ffdb0]/20'
          }`}
        >
          High Rollers
        </button>
        <button
          onClick={() => setFilter('My Bets')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            filter === 'My Bets'
              ? 'bg-[#1ffdb0] text-[#121212] shadow-lg shadow-[#1ffdb0]/20'
              : 'bg-[#273f61]/25 text-white hover:bg-[#1ffdb0] hover:text-[#121212] hover:shadow-lg hover:shadow-[#1ffdb0]/20'
          }`}
        >
          My Bets
        </button>
      </div>
      <div className='bet-list flex flex-col gap-[0px]'>
        <div className='header font-bold bg-[#131a22]/50 text-white p-4 grid grid-cols-6 items-center text-center'>
          <span>Game</span>
          <span>Player</span>
          <span>Time</span>
          <span>Bet</span>
          <span>Multiplier</span>
          <span>Payout</span>
        </div>
        {filteredBets.map((bet, index) => (
          <div
            key={index}
            className={`${
              index % 2 === 0 ? 'bg-[#273f61]/50' : 'bg-[#131a22]'
            } text-white rounded-lg p-4 grid grid-cols-6 items-center text-center transition-all duration-300 hover:bg-[#1ffdb0] hover:text-[#121212] hover:shadow-lg hover:shadow-[#1ffdb0]/20`}
          >
            <span className='font-medium'>{bet.game}</span>
            <span>{bet.player}</span>
            <span>{bet.time}</span>
            <span className='font-medium'>{bet.bet} M</span>
            <span className='font-medium'>{bet.multiplier}x</span>
            <span className='font-medium'>{bet.payout} M</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveBets;
