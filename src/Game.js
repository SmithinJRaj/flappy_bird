// src/Game.js

// ---------------- IMPORTS ----------------
import { Bird } from './Bird.js';
import { updatePipes, getScore, pipeWidth, pipeGap, getPipes, resetScore } from './Pipes.js';
import { isColliding } from './utils.js';

// ---------------- GAME STATES ----------------
const gameState = {
    ready: 0,
    start: 1,
    game_over: 2
};

let currentState = gameState.ready;

// ---------------- INITIALIZATION ----------------
const canvas = document.getElementById('canvas'); // getting canva element
const ctx = canvas.getContext('2d'); // 2D drawing context

// setting background image
const backgroundImage = new Image();
// NOTE: Paths are relative to index.html when served by the browser
backgroundImage.src = 'assets/images/flappy-bg.jpg';

// Instantiate the Bird object
const bird = new Bird(
    100, // x
    canvas.height / 2, // y (start in center)
    10, // radius
    '#FF0000', // color
    40, // width
    30, // height
    () => currentState, // function to dynamically get current state
    gameState, // game state
    'assets/images/flappy-bird.png' // imagePath
);

// ---------------- INPUT HANDLING ----------------
window.addEventListener('keydown',(e)=>{
    if(e.code === 'Space'){
        // if ready --> play
        if(currentState === gameState.ready){
            currentState = gameState.start;
        }
        // if play --> play(no change)
        // if game over --> restart game
        else if(currentState === gameState.game_over){
             bird.y = canvas.height/2;
             bird.velocity = 2;
             resetScore(); 
            bird.rotation = 0;
            currentState = gameState.ready;
        }
    }
});

// --- WINDOW AND INITIAL DRAWING HANDLERS ---
// The dimensions are now fixed by the HTML canvas attributes
function initialDraw() {
    // We no longer read innerWidth/innerHeight, we use the fixed dimensions
    const width = canvas.width;  // 288
    const height = canvas.height; // 512

    // Redraw the background immediately after resize
    ctx.drawImage(backgroundImage, 0, 0, width, height);
    // NOTE: We don't need to update bird.y here unless we want to reset it explicitly
}

// Initial setup and handling resize
backgroundImage.onload = function () {
    initialDraw();
    gameloop(); // Start the loop only once the background is loaded
}

// functions for different screens
function drawCenteredText(text, size,offsetY = 0) {
     ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Outline (makes text readable on any background)
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2 + offsetY);

    // White fill
    ctx.fillStyle = "white";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + offsetY);
}

// "Press SPACE to start" screen
function drawStartScreen(){
    drawCenteredText("Press SPACE", 28, -10);
    drawCenteredText("to begin", 28, 25);
}

// Game Over screen
function drawGameOverScreen(){
    const finalScore = getScore(); // <-- Get the score from the Pipes module
    
    drawCenteredText("GAME OVER",42,-40);
    
    drawCenteredText(`Score: ${finalScore}`, 32, 10);
    drawCenteredText("Press SPACE to restart", 28, 60);
}

// Show score while playing
function drawScore(){
    const currentScore = getScore();
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "left"; // align from left
    ctx.textBaseline = "top"; // align from top
    ctx.fillText(`Score: ${currentScore}`, 10, 10);
}

// ---------------- GAME LOOP ---------------
function gameloop() {
    // 1. CLEAR AND DRAW BACKGROUND
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    switch(currentState){
        case gameState.ready:
            // bird visible but stationary
            bird.draw(ctx);
            drawStartScreen();
            break;
            
        case gameState.start:
            // currently playing
            bird.update();

            // Update pipes and draw them
            updatePipes(ctx, canvas.width, canvas.height, bird);

            // Check collision between bird and pipes/ground
            if (isColliding(bird, getPipes(), canvas.height)) {
                currentState = gameState.game_over;
            }

            bird.draw(ctx);
            drawScore();
            break;

        case gameState.game_over:
            // Bird stays where it crashed
            bird.draw(ctx);
            drawGameOverScreen(); // Show GAME OVER UI
            break;       
    }
    // Request next animation frame → loop never ends
    requestAnimationFrame(gameloop);
}

// No need to call flap() or gameloop() here, they are called inside the Bird constructor and backgroundImage.onload
