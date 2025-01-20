import React from 'react';

const GameLayout = ({ game }) => {
  return (
    <div className="text-white">
      <h1 className="text-2xl">{game.name}</h1>
      <p>{game.description}</p>
      <img src={game.image} alt={game.name} className="w-full h-[320px] object-cover" />
    </div>
  );
};

export default GameLayout;
