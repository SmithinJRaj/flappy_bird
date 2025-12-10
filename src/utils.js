// src/utils.js
import { pipeWidth, pipeGap } from './Pipes.js';

/**
 * Checks if the bird collides with any pipe or the boundaries.
 * @param {Object} bird - Bird object with x, y, width, height
 * @param {Array} pipes - Array of pipe objects (each has x, center)
 * @param {number} canvasHeight - Height of the game screen
 * @returns {boolean} True if collision occurred.
 */
export function isColliding(bird, pipes, canvasHeight) {
    // 1. Check Floor/Ceiling Collision
    // We assume the bird's bounding box is centered at bird.x, bird.y
    const birdTop = bird.y - bird.height / 2;
    const birdBottom = bird.y + bird.height / 2;
    
    if (birdTop < 0 || birdBottom > canvasHeight) {
        return true;
    }

    // 2. Check Pipe Collision (AABB Logic)
    for (const pipe of pipes) {
        const topPipeEnd = pipe.center - (pipeGap / 2);
        const bottomPipeStart = pipe.center + (pipeGap / 2);

        // A. Horizontal Check (Are the objects close enough horizontally?)
        // Bird's right edge > Pipe's left edge AND Bird's left edge < Pipe's right edge
        const birdLeft = bird.x - bird.width / 2;
        const birdRight = bird.x + bird.width / 2;
        
        if (birdRight > pipe.x && birdLeft < pipe.x + pipeWidth) {
            
            // B. Vertical Check (Did the bird hit the solid part of the pipe?)

            // Collision with Top Pipe (Bird's top edge is above the gap)
            if (birdTop < topPipeEnd) {
                return true;
            }

            // Collision with Bottom Pipe (Bird's bottom edge is below the gap)
            if (birdBottom > bottomPipeStart) {
                return true;
            }
        }
    }
    
    return false;
}