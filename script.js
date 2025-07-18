// ===== GLOBAL REFERENCES =====
const knockoutSelect = document.getElementById("knockout-select");
const confirmedNumberSpan = document.getElementById("confirmed-number");
const scoreDisplay = document.getElementById("score");
const dice1Score = document.getElementById("dice1-score");
const dice2Score = document.getElementById("dice2-score");
const diceSumDisplay = document.getElementById("dice-sum");
const currentSumContainer = document.getElementById("current-sum");

// Dice visualization: Unicode dice characters
const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// Mapping symbols to their numeric values
const faceValues = {
    "⚀": 1,
    "⚁": 2,
    "⚂": 3,
    "⚃": 4,
    "⚄": 5,
    "⚅": 6
};

// ===== GAME STATE VARIABLES =====
let currentScore = 0;
let hasSafeRoll = true;
let hasWon = false;
let isRolling = false;  // Prevents spam-clicking during roll animation

// ===== INITIAL SETUP =====
// Set the default knockout number
let selectedKnockoutNumber = parseInt(knockoutSelect.value);
confirmedNumberSpan.textContent = selectedKnockoutNumber;

// Update knockout number when the user selects a new one
knockoutSelect.addEventListener("change", () => {
    selectedKnockoutNumber = parseInt(knockoutSelect.value);
    confirmedNumberSpan.textContent = selectedKnockoutNumber;
});

// ===== START GAME BUTTON =====
document.getElementById("start-game-btn").addEventListener("click", () => {
    // Stop the dice idle animation
    dice1.classList.remove("idle");
    dice2.classList.remove("idle");

    // Hide the dropdown for choosing a knockout number
    document.getElementById("knockout-select-container").classList.add("hidden");

    // Show the confirmed knockout number
    document.getElementById("knockout-confirmation").classList.remove("hidden");

    // Reset the score display
    currentScore = 0;
    scoreDisplay.textContent = currentScore;
    
    // Remove the faded placeholder effect from the score container
    document.getElementById("score-container").classList.remove("placeholder");

    // Hide the Start Game button section
    document.getElementById("start-game").classList.add("hidden");

    // Reveal the main game buttons after a slight delay
    setTimeout(() => {
        document.getElementById("buttons-roll-reset").classList.remove("hidden");
    }, 400);
});

// ===== SAFE-ROLL BUTTON =====
document.getElementById("safe-roll-btn").addEventListener("click", () => {
    hasSafeRoll = false;

    // Replace heart symbol and apply faded look
    const heart = document.getElementById("extra-life");
    heart.textContent = "🖤";
    heart.classList.add("used-heart");

    // Hide knockout overlay and Safe-Roll prompt
    document.getElementById("knockout-overlay").classList.add("hidden");
    document.getElementById("use-safe-roll").classList.add("hidden");

    // Bring back the roll/reset buttons
    setTimeout(() => {
        document.getElementById("buttons-roll-reset").classList.remove("hidden");
    }, 400);
});

// ===== KEEP-GOING BUTTON (AFTER WIN) =====
document.getElementById("keep-going-btn").addEventListener("click", () => {
    // Hide overlays for victory state
    document.getElementById("victory-overlay").classList.add("hidden");
    document.getElementById("player-wins").classList.add("hidden");

    // Show roll/reset buttons again
    setTimeout(() => {
        document.getElementById("buttons-roll-reset").classList.remove("hidden");
    }, 400);
});

// Wait for the DOM to fully load before running game logic.
// Ensures all elements (like dice and buttons) are available in the DOM.
// This prevents errors when trying to access or manipulate elements too early.
document.addEventListener("DOMContentLoaded", () => {
    // Start idle animation on both dice
    dice1.classList.add("idle");
    dice2.classList.add("idle");

    const button = document.getElementById("roll-btn");

    button.addEventListener("click", () => {
        if (isRolling) return; // Prevent rolling while a roll is already in progress
        isRolling = true;

        // Stop idle animation before starting the roll
        dice1.classList.remove("idle");
        dice2.classList.remove("idle");

        // Force restart of shake animation by triggering a reflow.
        // Accessing `offsetWidth` forces the browser to calculate layout,
        // using `void` discards the returned value
        dice1.classList.remove("shake");
        dice2.classList.remove("shake");
        void dice1.offsetWidth;
        void dice2.offsetWidth;

        // Add shake animation classes
        dice1.classList.add("shake");
        dice2.classList.add("shake");

        // Start rolling animation with random faces
        let interval = setInterval(() => {
            dice1.innerText = diceFaces[Math.floor(Math.random() * 6)];
            dice2.innerText = diceFaces[Math.floor(Math.random() * 6)];
        }, 100);

        // End animation after 600ms
        setTimeout(() => {
            // Stop the dice face animation 
            clearInterval(interval);

            // Select and display final faces
            const finalFace1 = diceFaces[Math.floor(Math.random() * 6)];
            const finalFace2 = diceFaces[Math.floor(Math.random() * 6)];
            dice1.innerText = finalFace1;
            dice2.innerText = finalFace2;

            // Convert to numeric values
            const value1 = faceValues[finalFace1];
            const value2 = faceValues[finalFace2];
            const total = value1 + value2;

            // Display roll summary
            currentSumContainer.classList.remove("hidden");
            dice1Score.textContent = value1;
            dice2Score.textContent = value2;
            diceSumDisplay.textContent = total;

            // Update score
            currentScore += total;
            scoreDisplay.textContent = currentScore;

            // ===== KNOCKOUT CONDITION =====
            if (total === selectedKnockoutNumber) {
                document.getElementById("knockout-overlay").classList.remove("hidden");
                document.getElementById("buttons-roll-reset").classList.add("hidden");

                setTimeout(() => {
                    if (hasSafeRoll) {
                        // Offer Safe-Roll option
                        document.getElementById("use-safe-roll").classList.remove("hidden");
                    } else {
                        // Trigger Game Over screen
                        document.getElementById("game-over").classList.remove("hidden");
                    }
                    isRolling = false;
                }, 1000);

                return;
            }

            // ===== VICTORY CONDITION =====
            if (!hasWon && currentScore >= 45) {
                hasWon = true;
                document.getElementById("victory-overlay").classList.remove("hidden");
                document.getElementById("buttons-roll-reset").classList.add("hidden");

                setTimeout(() => {
                    document.getElementById("player-wins").classList.remove("hidden");
                    isRolling = false;
                }, 1000);

                return;
            }

            // Re-enable rolling for the next round
            isRolling = false;
        }, 600);
    });
});

// ===== RESET BUTTONS (reload page) =====
["reset-btn1", "reset-btn2", "reset-btn3", "reset-btn4"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener("click", () => location.reload());
    }
});
