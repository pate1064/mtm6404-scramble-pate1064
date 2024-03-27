import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

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

const ScrambleGame = () => {
  const words = [
    'apple',
    'banana',
    'orange',
    'strawberry',
    'grape',
    'watermelon',
    'pineapple',
    'blueberry',
    'peach',
    'kiwi',
    'blueberry',
  ];

  const maxStrikes = 10;

  const shuffled = shuffle(words);

  const [gamecur, setGameState] = useState({
    words: shuffled,
    curwrdIndex: 0,
    currentWord: shuffle(shuffled[0]),
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
    localStorage.setItem('scrambleGameState', JSON.stringify(gamecur));
  }, [gamecur]);

  const Guess = (event) => {
    event.preventDefault();
    const guess = event.target.elements.guess.value.toLowerCase();
    const { curwrdIndex, points, strikes, passes, words } = gamecur;

    if (guess === words[curwrdIndex]) {
      const newWords = [...words];
      newWords.splice(curwrdIndex, 1);

      setGameState((prevState) => ({
        ...prevState,
        words: newWords,
        curwrdIndex:
        curwrdIndex < newWords.length ? curwrdIndex : 0,
        currentWord: shuffle(
          newWords[curwrdIndex < newWords.length ? curwrdIndex : 0]
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
    const { curwrdIndex, passes, words } = gamecur;
    let newWords = [...words]; 
  
    if (passes > 0) {
      newWords.splice(curwrdIndex, 1);
      setGameState((prevState) => ({
        ...prevState,
        words: newWords,
        curwrdIndex:
        curwrdIndex < newWords.length ? curwrdIndex : 0,
        currentWord: shuffle(
          newWords[curwrdIndex < newWords.length ? curwrdIndex : 0]
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
      words: shuffle(words),
      curwrdIndex: 0,
      currentWord: shuffle(words[0]),
      points: 0,
      strikes: 0,
      passes: 3,
      gameOver: false,
    });
  };

  const { currentWord, points, strikes, passes, gameOver } = gamecur;

  return (
    <div>
      {!gameOver && (
        <div>
          <h1>Scramble Game</h1>
          <div>Points: {points}</div>
          <div>Strikes: {strikes}</div>
          <div>Passes: {passes}</div>
          <div>Current Word: {currentWord}</div>
          <form onSubmit={Guess}>
            <input type='text' name='guess' />
            <button type='submit'>Guess</button>
          </form>
          <button onClick={handlePass} disabled={passes === 0}>
            Pass
          </button>
        </div>
      )}
      {gameOver && (
        <div>
          <h1>Game Over!</h1>
          <div>Total Points: {points}</div>
          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default ScrambleGame;

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));
