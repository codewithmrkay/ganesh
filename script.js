let bg = document.getElementById('gameCanvas');
let end = document.querySelector('.end');
let mainMenu = document.querySelector('.card')
let Playbtn = document.querySelector('#Playbtn')
var x = document.getElementById("myAudio");
const musicButton = document.getElementById('music-btn');
const audioPlayer = document.getElementById('audio-player');
const sfxPlayer = document.getElementById('sfx-player');
const levelUpMessage = document.getElementById('level-up-message');
function playAudio() {
    x.play();
}
// Example sound effect file paths
const modakCatchSFX = 'modakCatch.mp3';
const gameOverSFX = 'sidemove.mp3';

// Call these functions whenever the events happen in the game
// Play modak catch sound
// playSFX(gameOverSFX);   // Play game over sound

end.addEventListener("click", () => {
    startGame()  
})
function endg() {
    mainMenu.style.display = 'block'
    end.style.display = `block`;
    bg.style.opacity = '.3'
}
 // Function to show the "Level Up!" message and animate it
const showLevelUpMessage = () => {
    sfxPlayer.src=sfxs[1]
    sfxPlayer.play()
    levelUpMessage.classList.add('show');

    // After 1 seconds, hide the message by removing the class
    setTimeout(() => {
        levelUpMessage.classList.remove('show');
    }, 1000);
};

// Simulating loading percentage
let loadingProgress = 0;
let loadingInterval = setInterval(() => {
    if (loadingProgress < 90) {
        loadingProgress += 1;
        document.getElementById('loadingBar').style.width = loadingProgress + '%';
        document.getElementById('loadingPercentage').textContent = loadingProgress + '%';
    }
}, 50); // Adjust the speed as per your requirement

// When everything is fully loaded (entire window)
window.onload = function () {
    // Complete the loading animation (set to 100%)
    loadingProgress = 100;
    document.getElementById('loadingBar').style.width = '100%';
    document.getElementById('loadingPercentage').textContent = '100%';

    // Clear the interval and remove loading screen after short delay
    clearInterval(loadingInterval);

    setTimeout(() => {
        // Hide the loading screen
        document.getElementById('loadingScreen').style.display = 'none';
    }, 500); // Delay of 0.5 seconds for smooth transition
};
Playbtn.addEventListener("click", () => {
    audioPlayer.play()
    mainMenu.style.display = 'none'
    // Show the game canvas
    document.getElementById('gameCanvas').style.display = 'block';
    bg.style.opacity = '1'
    end.style.display = 'none'
    // Start the game
    startGame();  // Call your function to start the game here
})
// Function to start the game
function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    document.fonts.ready.then(function () {

        ctx.font = '30px mushak'; // Use the font-family name exactly as specified in CSS
        ctx.fillStyle = 'black';
    })
    // Set canvas dimensions to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //*----------------------------- Path to your background images
    const ganesh = {
        x: canvas.width / 2 - 40,
        y: canvas.height - 150,
        width: 120,
        height: 120,
        dx: 0,
        speed: 10,
        image: new Image(),
    };

    ganesh.image.src = 'ganesh.png'; // Replace with your Ganesh image
    const bg = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        dx: 0,
        speed: 10,
        image: new Image(),
    };
    bg.image.src = 'bg_level1.jpg';
    const modak = {
        width: 50,
        height: 50,
        speed: 3,
        modaks: [],
        image: new Image(),
    };

    modak.image.src = 'modak.png'; // Replace with your Modak image

    let score = 0;
    let level = 1;
    let gameOver = false;

    function drawGanesh() {
        ctx.drawImage(ganesh.image, ganesh.x, ganesh.y, ganesh.width, ganesh.height);
    }

    function drawbg() {
        ctx.drawImage(bg.image, bg.x, bg.y, bg.width, bg.height);
        console.log('icall ')
    }
    function drawModak(x, y) {
        ctx.drawImage(modak.image, x, y, modak.width, modak.height);
    }

    function moveGanesh() {
        ganesh.x += ganesh.dx;

        // Keep Ganesh within the screen bounds
        if (ganesh.x < 0) ganesh.x = 0;
        if (ganesh.x + ganesh.width > canvas.width) ganesh.x = canvas.width - ganesh.width;
    }

    function generateModak() {
        const x = Math.random() * (canvas.width - modak.width);
        modak.modaks.push({ x, y: 0 });
    }

    function updateModaks() {
        modak.modaks.forEach((m, i) => {
            m.y += modak.speed;
            drawModak(m.x, m.y);

            // Check if modak is caught by Ganesh
            if (
                m.y + modak.height >= ganesh.y &&
                m.x >= ganesh.x &&
                m.x + modak.width <= ganesh.x + ganesh.width
            ) {
                playAudio(modakCatchSFX)
                score++;
                modak.modaks.splice(i, 1); // Remove modak from the array

                // Check for level progression
                if (score % 20 === 0) {
                    level++;
                    showLevelUpMessage()
                    modak.speed += 2; // Increase speed of modaks with each level
                }
            }

            // Remove modak if it goes off-screen
            if (m.y > canvas.height) {
                modak.modaks.splice(i, 1);
                gameOver = true;
            }
        });
    }

    function drawScore() {
        ctx.fillStyle = '#000';
        ctx.font = '24px mushak';
        ctx.fillText(`Score: ${score}`, 10, 30);
        ctx.fillText(`Level: ${level}`, 10, 60);
    }

    function drawGameOver() {
        endg()
        sfxPlayer.src=sfxs[3]
    sfxPlayer.play()
        // ctx.fillStyle = '#f00';
        // ctx.font = '48px mushak';
        // ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    }

    function update() {
        if (gameOver) {
            drawGameOver();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveGanesh();
        drawGanesh();
        updateModaks();
        drawScore();
        // drawbg();
        requestAnimationFrame(update);
    }

    // Control Ganesh with touch
    canvas.addEventListener('touchstart', (e) => {
        sfxPlayer.src=sfxs[2]
        sfxPlayer.play()
        if (e.touches[0].clientX < canvas.width / 2) {
            ganesh.dx = -ganesh.speed;
        } else {
            ganesh.dx = ganesh.speed;
        }
    });

    canvas.addEventListener('touchend', () => {
        ganesh.dx = 0;
    });

    // Control Ganesh with mouse
    canvas.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        ganesh.x = mouseX - ganesh.width / 2;

        // Keep Ganesh within the screen bounds
        if (ganesh.x < 0) ganesh.x = 0;
        if (ganesh.x + ganesh.width > canvas.width) ganesh.x = canvas.width - ganesh.width;
    });

    // Generate modak every 2 seconds
    setInterval(generateModak, 2000);

    update();

}

// todo------------------------------------------------------bg audio controller

const songs = ['song1.mp3', 'song2.mp3', 'song3.mp3'];  // Replace with your song files
const sfxs = ['modakCatch.mp3','levelUp.mp3','sidemove.mp3','gameOver.mp3']
let currentSongIndex = 0;
let isMuted = false;
audioPlayer.volume='0.2';
// Function to switch songs or mute/unmute
const toggleMusic = () => {
    if (!isMuted) {
        // Cycle through songs
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
        } else {
            // Mute after all songs have played
            audioPlayer.muted = true;
            isMuted = true;
            currentSongIndex = 0;
            return;
        }
        audioPlayer.src = songs[currentSongIndex];
    } else {
        // Unmute and start from song 1
        audioPlayer.muted = false;
        isMuted = false;
        audioPlayer.src = songs[0];
        currentSongIndex = 0;
    }

    audioPlayer.play();
};

// Event listener to handle music toggle
musicButton.addEventListener('click', toggleMusic);

// Start playing the first song when the page loads
audioPlayer.play();



