import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import the CSS file where you have your styles

// Shuffle function
function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === 'string') {
    return copy.join('');
  }

  return copy;
}

// Main component
const ScrambleGame = () => {
  const wordsArray = [
    'mango',
    'plum',
    'apricot',
    'pomegranate',
    'dragonfruit',
    'raspberry',
    'blackberry',
    'cantaloupe',
    'guava',
    'lychee',
  ];

  const maxStrikes = 10;

  const shuffledArray = shuffle(wordsArray);

  const [gameState, setGameState] = useState({
    words: shuffledArray,
    currentWordIndex: 0,
    currentWord: shuffle(shuffledArray[0]),
    points: 0,
    strikes: 0,
    passes: 3,
    gameOver: false,
  });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (savedState) {
      setGameState(savedState);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scrambleGameState', JSON.stringify(gameState));
  }, [gameState]);

  const handleGuess = (event) => {
    event.preventDefault();
    const guess = event.target.elements.guess.value.toLowerCase();
    const { currentWordIndex, points, strikes, passes, words } = gameState;

    if (guess === words[currentWordIndex]) {
      const newWords = [...words];
      newWords.splice(currentWordIndex, 1);

      setGameState((prevState) => ({
        ...prevState,
        words: newWords,
        currentWordIndex:
          currentWordIndex < newWords.length ? currentWordIndex : 0,
        currentWord: shuffle(
          newWords[currentWordIndex < newWords.length ? currentWordIndex : 0]
        ),
        points: points + 1,
      }));

      alert("Correct Guess")
    } else {
      setGameState((prevState) => ({
        ...prevState,
        strikes: strikes + 1,
        gameOver: strikes + 1 >= maxStrikes,
      }));
      alert("Incorrect Guess")
    }
    event.target.reset();
  };

  const handlePass = () => {
    const { currentWordIndex, passes, words } = gameState;
    let newWords = [...words]; 
  
    if (passes > 0) {
      newWords.splice(currentWordIndex, 1);
      setGameState((prevState) => ({
        ...prevState,
        words: newWords,
        currentWordIndex:
          currentWordIndex < newWords.length ? currentWordIndex : 0,
        currentWord: shuffle(
          newWords[currentWordIndex < newWords.length ? currentWordIndex : 0]
        ),
        passes: passes - 1,
      }));
    }
  
    if (passes - 1 === 0 && newWords.length === 0) {
      setGameState((prevState) => ({
        ...prevState,
        gameOver: true,
      }));
    }
  };

  const handlePlayAgain = () => {
    setGameState({
      words: shuffle(wordsArray),
      currentWordIndex: 0,
      currentWord: shuffle(wordsArray[0]),
      points: 0,
      strikes: 0,
      passes: 3,
      gameOver: false,
    });
  };

  const { currentWord, points, strikes, passes, gameOver } = gameState;

  return (
    <div className="container">
      {!gameOver && (
        <div className="game">
          <h1 className="title">Scramble Game</h1>
          <div className="info">
            <div className="points">Points: {points}</div>
            <div className="strikes">Strikes: {strikes}</div>
            <div className="passes">Passes: {passes}</div>
          </div>
          <div className="word">Current Word: {currentWord}</div>
          <form onSubmit={handleGuess} className="form">
            <input type='text' name='guess' className="input" />
            <button type='submit' className="button">Guess</button>
          </form>
          <button onClick={handlePass} disabled={passes === 0} className="pass-button">
            Pass
          </button>
        </div>
      )}
      {gameOver && (
        <div className="game-over">
          <h1 className="game-over-title">Game Over!</h1>
          <div className="total-points">Total Points: {points}</div>
          <button onClick={handlePlayAgain} className="play-again-button">Play Again</button>
        </div>
      )}
    </div>
  );
};

export default ScrambleGame;

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));
