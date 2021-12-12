const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

// net
const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FFF",
};

// user paddle
const user = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#FFF",
  score: 0,
};

// AI
const ai = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "#FFF",
  score: 0,
};

// ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: "#05EDFF",
};

// Net properties
function drawNet() {
  ctx.fillStyle = net.color;
  ctx.fillRect(net.x, net.y, net.width, net.height);
}

// Score properties
function drawScore(x, y, score) {
  ctx.fillStyle = "#fff";
  ctx.font = "35px sans-serif";
  ctx.fillText(score, x, y);
}

// Paddle properties
function drawPaddle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// Ball properties
function drawBall(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
}

// Add an eventListener to browser window
window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);

// Pressing the down key
function keyDownHandler(event) {
  switch (event.keyCode) {
    // get the keycode
    case 38:
      upArrowPressed = true;
      break;

    case 40:
      downArrowPressed = true;
      break;
  }
}

// Pressing the up key
function keyUpHandler(event) {
  switch (event.keyCode) {
    case 38:
      upArrowPressed = false;
      break;

    case 40:
      downArrowPressed = false;
      break;
  }
}

// Reset the ball position
function reset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;

  //Change directions
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

//Collision detection function
function collisionDetect(player, ball) {
  player.top = player.y;
  player.right = player.x + player.width;
  player.bottom = player.y + player.height;
  player.left = player.x;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return (
    ball.left < player.right &&
    ball.top < player.bottom &&
    ball.right > player.left &&
    ball.bottom > player.top
  );
}
// regularly updates
function update() {
  // Player paddle Movement
  if (upArrowPressed && user.y > 0) {
    user.y -= 8;
  } else if (downArrowPressed && user.y < canvas.height - user.height) {
    user.y += 8;
  }

  // Wall Collision detecting
  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    ball.velocityY = -ball.velocityY;
  }

  // Right wall collision
  if (ball.x + ball.radius >= canvas.width) {
    // Player scores
    user.score += 1;
    reset();
  }

  // Left wall collision
  if (ball.x - ball.radius <= 0) {
    // Enemy scores
    ai.score += 1;
    reset();
  }

  // Ball movement
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // AI paddle movement
  ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;

  // Paddle collision
  let player = ball.x < canvas.width / 2 ? user : ai;
  if (collisionDetect(player, ball)) {
    let angle = 0;
    //If it hits top of paddle
    if (ball.y < player.y + player.height / 2) {
      //Angle becomes -45 degrees
      angle = (-1 * Math.PI) / 4;
    }
    //If it hits bottom of paddle
    else if (ball.y > player.y + player.height / 2) {
      //Angle becomes 45 degrees
      angle = Math.PI / 4;
    }
    
    ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle); 

    ball.speed += 0.2;
  }
}

//  Display all items on screen
function render() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawNet();
  drawScore(canvas.width / 4, canvas.height / 6, user.score);
  drawScore((3 * canvas.width) / 4, canvas.height / 6, ai.score);
  drawPaddle(user.x, user.y, user.width, user.height, user.color);
  drawPaddle(ai.x, ai.y, ai.width, ai.height, ai, color);
  drawBall(ball.x, ball.y, ball.radius, ball.color);
}

// This makes the game play again on loop
function gameLoop() {
  update();
  render();
}
// Allows the game to play at 60fps
setInterval(gameLoop, 1000 / 60);
