// Gregory Pierot
// CPSC 349

import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  POISON_APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
} from "./constants";

const App = () => {
  const canvasRef = useRef(); // Create canvas
  const [snake, setSnake] = useState(SNAKE_START); // Snake start
  const [apple, setApple] = useState(APPLE_START); // Apple start
  const [papple, setPApple] = useState(POISON_APPLE_START); // Poison Appple start
  const [dir, setDir] = useState([0, -1]); // Start going upwards
  const [speed, setSpeed] = useState(null); // No speed increase at the start
  const [gameOver, setGameOver] = useState(false); // Game has to start

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };

  const moveSnake = ({ keyCode }) =>
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE))); // Apple spawns randomly on canvas
  
  const createPApple = () =>
    papple.map((_a, j) => Math.floor(Math.random() * Math.random() * (CANVAS_SIZE[j] / SCALE))); 
    // Poison apple spawns randomly but different than Apple

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] || // X-cord of the snake
      piece[0] < 0 ||                       // Colliding
      piece[1] * SCALE >= CANVAS_SIZE[1] || // Y-cord of the snake
      piece[1] < 0                          // Colliding
    )
      return true;

    // Loop through snake and see if there is collision
    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      let newPapple = createPApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
        newPapple = createPApple();
      }
      setApple(newApple);
      setPApple(newPapple);
      return true;
    }
    return false;
  };

  const checkPAppleCollision = newSnake => {
    // if (newSnake[0][0] === papple[0] && newSnake[0][1] === papple[1]) {
    //   //return true;
    // }
  }

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake)); // Make a copy so Snake can grow
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]]; // Snake grows
    snakeCopy.unshift(newSnakeHead); // Snake head is added
    if (checkCollision(newSnakeHead)) endGame();
    if (checkPAppleCollision()) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  // Starting position calls
  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setPApple(POISON_APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0); // Every render needs to be set
    context.clearRect(0, 0, window.innerWidth, window.innerHeight); // Clear canvas after render
    context.fillStyle = "green"; // Snake is green
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1)); // Drawing one pixel size
    context.fillStyle = "red"; // Apple is red
    context.fillRect(apple[0], apple[1], 1, 1); // Drawing one pixel size
    context.fillStyle = "purple"; // Poison Apple is purple
    context.fillRect(papple[0], papple[1], 1, 1); // Drawing one pixel size
  }, [snake, apple, papple, gameOver]);

  return (
    <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
      <canvas
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div>GAME OVER!</div>}
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default App;
