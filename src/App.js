// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import NameInput from './NameInput';

const App = () => {
  const [name, setName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);

  const generateInitialTiles = () => {
    const imageCount = 6;
    const imageWidth = 100;
    const imageHeight = 100;

    const images = Array.from({ length: imageCount }, (_, index) =>
      `https://picsum.photos/id/${index + 1}/${imageWidth}/${imageHeight}`
    );

    const pairs = images.concat(images);
    const shuffledPairs = pairs.sort(() => Math.random() - 0.5);

    return shuffledPairs.map((imageUrl, index) => ({
      id: index + 1,
      imageUrl,
      isMatched: false,
      isFlipped: false,
    }));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleNameSubmit = (userName) => {
    setName(userName);
  };

  const startGame = () => {
    if (name.trim() !== '') {
      setGameStarted(true);
      setTiles(generateInitialTiles());
    }
  };

// Update handleClickTile function
const handleClickTile = (id) => {
  if (selectedTiles.length === 2) {
    return;
  }

  const alreadyFlipped = selectedTiles.includes(id);

  if (alreadyFlipped) {
    // If the same tile is clicked twice, increase the score
    setScore((prevScore) => prevScore + 1);
    return;
  }

  const updatedTiles = tiles.map((tile) =>
    tile.id === id ? { ...tile, isFlipped: true } : tile
  );

  setTiles(updatedTiles);
  setSelectedTiles([...selectedTiles, id]);

  if (selectedTiles.length === 1) {
    setTimeout(checkForMatch, 1000);
  }
};

// Update checkForMatch function
// Update checkForMatch function
const checkForMatch = () => {
  const [firstTileId, secondTileId] = selectedTiles;

  const firstTile = tiles.find((tile) => tile.id === firstTileId);
  const secondTile = tiles.find((tile) => tile.id === secondTileId);

  if (!firstTile || !secondTile) {
    setSelectedTiles([]);
    return;
  }

  const areMatching = firstTile.imageUrl === secondTile.imageUrl;

  const updatedTiles = tiles.map((tile) =>
    tile.id === firstTileId || tile.id === secondTileId
      ? { ...tile, isFlipped: areMatching ? true : false, isMatched: areMatching }
      : tile
  );

  setTiles(updatedTiles);

  if (areMatching) {
    setScore((prevScore) => prevScore + 1);
  } else {
    // Decrease the score when there is no match
    setScore((prevScore) => prevScore - 1);
    setTimeout(() => {
      const resetTiles = tiles.map((tile) =>
        tile.id === firstTileId || tile.id === secondTileId
          ? { ...tile, isFlipped: false }
          : tile
      );
      setTiles(resetTiles);
      setSelectedTiles([]);
    }, 1000);
  }

  if (updatedTiles.every((tile) => tile.isMatched)) {
    setTimeout(() => {
      alert(`Congratulations, ${name}! You completed the game in ${timer} seconds with a score of ${score}.`);
      resetGame();
    }, 1000);
  } else {
    setSelectedTiles([]);
  }
};

  

  const finishGame = () => {
    const allTilesMatched = tiles.every((tile) => tile.isMatched);
  
    if (allTilesMatched) {
      alert(`Congratulations, ${name}! You completed the game in ${timer} seconds with a score of ${score}.`);
      resetGame();
    }
  };
  

  const resetGame = () => {
    // Clear the user's name from local storage
    localStorage.removeItem('userName');
  
    setName('');
    setGameStarted(false);
    setTiles([]);
    setSelectedTiles([]);
    setScore(0);
    setTimer(0);
  };
  

  return (
    <div className="app-container">
      {!gameStarted && (
        <div className="welcome-screen">
          <h1>Tile Matching Game</h1>
          <NameInput onNameSubmit={handleNameSubmit} />
          <button className='startgame' onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameStarted && (
        <div className="game-board">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className={`tile ${tile.isFlipped ? 'flipped' : ''} ${tile.isMatched ? 'matched' : ''}`}
              onClick={() => handleClickTile(tile.id)}
            >
              {tile.isFlipped && !tile.isMatched && <img src={tile.imageUrl} alt={`Tile ${tile.id}`} />}
            </div>
          ))}
          <div className="score-timer">
            <p>{`Player: ${name}`}</p>
            <p>Score: {score}</p>
            <p>Timer: {timer} seconds</p>
          </div>
          {finishGame()}
          <button className='startgame' onClick={resetGame}>Reset Game</button>
        </div>
      )}
    </div>
  );
};

export default App;
