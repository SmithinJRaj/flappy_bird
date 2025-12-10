// src/Game.js

import { Bird } from './Bird.js';
import { updatePipes, getScore, pipeWidth, pipeGap, getPipes } from './Pipes.js';
import { isColliding } from './utils.js';


// Game States
const gameState = {
    ready: 0,
    start: 1,
    game_over: 2
};

let currentState = gameState.ready;

// --- INITIALIZATION ---

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
    gameState,
    'assets/images/flappy-bird.png' // imagePath
);

// State Change handling

window.addEventListener('keydown',(e)=>{
    if(e.code === 'Space'){
        // if ready --> play
        // if play --> play(no change)
        if(currentState === gameState.ready){
            currentState = gameState.start;
        }
        // if game over --> restart game
        else if(currentState === gameState.game_over){
             bird.y = canvas.height/2;
             bird.velocity = 2;
             score = 0;
             currentState = gameState.ready;
            bird.rotation = 0;
        }
    }
});

// --- WINDOW AND RESIZE HANDLERS ---

// --- WINDOW AND INITIAL DRAWING HANDLERS ---
// The dimensions are now fixed by the HTML canvas attributes!

function initialDraw() {
    // We no longer read innerWidth/innerHeight, we use the fixed dimensions
    const width = canvas.width;  // 288
    const height = canvas.height; // 512

    // Redraw the background immediately after resize
    ctx.drawImage(backgroundImage, 0, 0, width, height);
    
    // NOTE: We don't need to update bird.y here unless we want to reset it explicitly
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw the background immediately after resize
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    // Update bird's starting Y if canvas height changed drastically
    if (bird) { 
        bird.y = canvas.height / 2;
    }
}

// Initial setup and handling resize
backgroundImage.onload = function () {
    initialDraw();
    gameloop(); // Start the loop only once the background is loaded
}

// functions for different screens
function drawCenteredText(text, size) {
    ctx.fillStyle = "white";
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawStartScreen(){
    drawCenteredText("Press SPACE to begin the game",50);
}

function drawGameOverScreen(){
    const finalScore = getScore(); // <-- Get the score from the Pipes module
    
    drawCenteredText("GAME OVER",60);
    
    // FIX REQUIRED: Change 'score' to 'finalScore'
    ctx.fillText(`Score: ${finalScore}`, canvas.width / 2, canvas.height / 2 + 60); 
    
    ctx.fillText("Press SPACE to restart the game", canvas.width / 2, canvas.height / 2 + 120);
}


function drawScore(){
    const currentScore = getScore();
    ctx.fillStyle = "white";
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillText(currentScore, canvas.width / 2, 100);
}
// --- GAME LOOP ---

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

            updatePipes(ctx, canvas.width, canvas.height, bird);

            if (isColliding(bird, getPipes(), canvas.height)) {
                currentState = gameState.game_over;
            }

            bird.draw(ctx);
            drawScore();
            // pipes score etc
            break;

        case gameState.game_over:
            bird.draw(ctx);
            drawGameOverScreen();
            break;       
    }

    /*
    // 2. UPDATE GAME OBJECTS (Physics/Movement)
    bird.update(); // Update the bird's position

    // 3. DRAW GAME OBJECTS
    bird.draw(ctx); // Draw the bird using the context
    */
    
    // 4. LOOP
    requestAnimationFrame(gameloop);
}

// No need to call flap() or gameloop() here, they are called inside the Bird constructor and backgroundImage.onload
