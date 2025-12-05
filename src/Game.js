// src/Game.js

import { Bird } from './Bird.js';


// Game States
const gameState = {
    ready: 0,
    start: 1,
    game_over: 2
};

let currentState = gameState.ready;
let score = 0;

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
        }
    }
});

// --- WINDOW AND RESIZE HANDLERS ---

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
    resize();
    gameloop(); // Start the loop only once the background is loaded
}
window.addEventListener('resize', resize);

// functions for different screens
function drawCenteredText(text, size) {
    ctx.fillStyle = "white";
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawStartScreen(){
    drawCeneteredText("Press SPACE to begin the game",50);
};

function drawGameOverScreen(){
    drawCeneteredText("GAME OVER",60);
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText("Press SPACE to restart the game", canvas.width / 2, canvas.height / 2 + 120);
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
            bird.draw(ctx);
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
