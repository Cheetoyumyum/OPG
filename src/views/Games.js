import React from 'react';
import { useParams } from 'react-router-dom';

const Games = () => {
  const { gameName } = useParams();

  return (
    <div>
      {gameName ? (
        <h1>Game Details for {gameName}</h1>
        // Render the details of the game based on `gameName`
      ) : (
        <h1>Games List</h1>
        // Render the list of games here
      )}
    </div>
  );
};

export default Games;
