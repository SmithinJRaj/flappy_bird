// src/Pipes.js

// 1. Pipe Constants: Define properties that won't change during the game
export const pipeWidth = 52;  
export const pipeGap = 120;   
export const pipeSpeed = 1;

const pipeTileHeight = 50;

// Load the pipe images
const pipeTopImage = new Image();
pipeTopImage.src = 'assets/images/pipe-top.png'; // Make sure this path is correct

const pipeBottomImage = new Image();
pipeBottomImage.src = 'assets/images/pipe-bottom.png'; // Make sure this path is correct

// 2. Game Variables
let pipes = [];     
let frameCount = 0; 
let score = 0;      

// 3. Export Accessor Functions (No change)
export function getPipes() {
    return pipes;
}

export function getScore() {
    return score;
}

export function drawPipe(ctx, pipe, canvasHeight) {
    const topPipeEnd = pipe.center - pipeGap / 2;
    const bottomPipeStart = pipe.center + pipeGap / 2;

    const imgH = pipeTopImage.height;
    const imgW = pipeWidth;

    // ---------- TOP PIPE (clipped, NOT scaled) ----------
    ctx.save();
    ctx.beginPath();
    ctx.rect(pipe.x, 0, imgW, topPipeEnd); // visible area only
    ctx.clip();

    // Draw normally from the bottom upward
    ctx.drawImage(
        pipeTopImage,
        pipe.x,
        topPipeEnd - imgH
    );
    ctx.restore();

    // ---------- BOTTOM PIPE (clipped, NOT scaled) ----------
    ctx.save();
    ctx.beginPath();
    ctx.rect(pipe.x, bottomPipeStart, imgW, canvasHeight - bottomPipeStart);
    ctx.clip();

    ctx.drawImage(
        pipeBottomImage,
        pipe.x,
        bottomPipeStart
    );
    ctx.restore();
}

// Function to update the pipes array (movement and drawing)
export function updatePipes(ctx, canvasWidth, canvasHeight, bird) {
    // 1. Movement and Drawing
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        
        // Move the pipe left
        pipe.x -= pipeSpeed;
        
        // Draw the pipe (Now draws images instead of rectangles!)
        drawPipe(ctx, pipe, canvasHeight);

        if (pipe.x + pipeWidth < bird.x - bird.width/2 && pipe.passed === false) {
            score++;
            pipe.passed = true;
            // Ideally, here you'd play a score sound!
        }
    }
    
    frameCount++;
    if (frameCount % 200 === 0) { 
        // Define the safe vertical limits for the GAP'S CENTER POINT.
        // We need to ensure the entire gap (pipeGap) plus some pipe is visible
        const minCenterY = 50 + (pipeGap / 2); 
        const maxCenterY = canvasHeight - 50 - (pipeGap / 2); 
        
        // Calculate the random center Y position
        const randomCenterY = Math.floor(Math.random() * (maxCenterY - minCenterY + 1)) + minCenterY;

        pipes.push({
            x: canvasWidth, 
            center: randomCenterY, // NEW property: The Y-coordinate of the center of the gap
            passed: false 
        });
    }

    // --- STEP 4: Pipe Cleanup ---
    // Remove pipes that have moved off-screen (x + width > 0)
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}