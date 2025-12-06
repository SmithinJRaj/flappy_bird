// src/Pipes.js

// 1. Pipe Constants: Define properties that won't change during the game
export const pipeWidth = 50;  // The width of all pipes in pixels
export const pipeGap = 120;   // The vertical size of the opening (the space the bird flies through)
export const pipeSpeed = 2;   // How many pixels the pipes move left per frame (speed of the game)

// 2. Game Variables: Variables that will change during the game
let pipes = [];     // This array will store all the active pipe objects (their x, y, and height)
let frameCount = 0; // Used to time when a new pipe should be generated
let score = 0;      // Tracks the player's score

// 3. Export Accessor Functions: Allow other files (like Game.js) to read the data
export function getPipes() {
    return pipes;
}

export function getScore() {
    return score;
}

export function drawPipe(ctx, pipe, canvasHeight) {
    ctx.fillStyle = '#00FF00'; // Green color for the pipes

    // 1. Draw the TOP pipe
    // (x, y, width, height)
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

    // 2. Draw the BOTTOM pipe
    // The starting y is after the top pipe + the gap
    ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvasHeight);
}


// Function to update the pipes array (movement and drawing)
export function updatePipes(ctx, canvasWidth, canvasHeight) {
    // 1. Movement and Drawing
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        
        // Move the pipe left
        pipe.x -= pipeSpeed;
        
        // Draw the pipelet score = 0;
        drawPipe(ctx, pipe, canvasHeight);
    }
    
    // NOTE: Pipe generation and cleanup will be added in Step 3
}