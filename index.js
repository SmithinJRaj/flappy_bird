let bird ={ x:300, y:450, radius:10, color:'#FF0000'};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'flappy-bg.jpg';

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(backgroundImage, 0, 0,canvas.width, canvas.height)
}

backgroundImage.onload = function () {
    resize();
}

function drawbird(bird) {
    ctx.beginPath();
    ctx.fillStyle = bird.color;
    ctx.arc(bird.x,bird.y,bird.radius, 0, Math.PI * 2);
    ctx.fill();
    const width = 40;
    const height = 30;
    ctx.drawImage(birdImage, bird.x-width/2, bird.y - height/2, width, height)
    ctx.closePath();
}

let space=false;

function flap() {
    window.addEventListener('keydown', function(event) {
        if(event.code === 'Space') {
            space = true;
        }
    });

    window.addEventListener('keyup', function(event) {
        if(event.code === 'Space') {
            space = false;
        }
    });
}

const birdImage = new Image();
birdImage.src = 'flappy-bird.png';

window.addEventListener('resize',resize);

let velocity =2;

function gameloop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(backgroundImage,0,0,canvas.width, canvas.height);
    if(space)
    {
        velocity = -10;
    }
    bird.y = bird.y+velocity;
    if(velocity != 2)
    {
        velocity = velocity + 2;
    }
    drawbird(bird);
    requestAnimationFrame(gameloop);
}

flap();
gameloop();