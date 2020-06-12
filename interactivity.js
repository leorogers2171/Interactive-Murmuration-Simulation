/**
 * Script to control the interativity components in the browser
 *
 * Listens for onclick & mousemove
 * An extension of canvas.js
 *
 */


/**
 * Global variable declaration
 * Returns an Element object representing the element whose id property matches the specified string.
 */
let item = document.getElementById("my-canvas"); //Canvas
let mouseDownPress = false; //Start and stop bird creation
let instructionsButton = document.getElementById("instructions-button");
let instructionsModal = document.getElementById("instructions-modal");
let instructionsCloseButton = document.getElementsByClassName("close")[0];

//Define sliders
let alignmentSlider = document.getElementById("alignment-slider");
let cohesionSlider = document.getElementById("cohesion-slider");
let separationSlider = document.getElementById("separation-slider");

//Defint buttons
let addBirdsButton = document.getElementById("add-birds-button");
let removeBirdsButton = document.getElementById("remove-birds-button");
let rainbowModeButton = document.getElementById("rainbow-button");
let resetButton = document.getElementById("reset-button");
let muteButton = document.getElementById("mute-button");

//X and Y of cursor position
let cursorXPosition = 0;
let cursorYPosition = 0;


/**
 * Listen for interactivity
 * Sets up a function that will be called whenever the specified event is delivered to the target.
 */

//On-canvas events
//Mouse click down event    
item.addEventListener("mousedown", mouseDown, false);
//Mouse click up event
item.addEventListener("mouseup", mouseUp, false);
//Mouse movement update cooridantes
item.addEventListener("mousemove", getCursorPositionXY, false)

//Listening for Instruction click
instructionsButton.addEventListener("click", displayInstructions, false);
//Listening for Modal close click
instructionsCloseButton.addEventListener("click", closeInstructions, false);

//Slider events
alignmentSlider.addEventListener("mouseup", updateValues, false);
cohesionSlider.addEventListener("mouseup", updateValues, false);
separationSlider.addEventListener("mouseup", updateValues, false);

//Add more birds event
addBirdsButton.addEventListener("click", buttonMoreBirds, false);
removeBirdsButton.addEventListener("click", buttonLessBirds, false);

//Other button events
rainbowModeButton.addEventListener("click", buttonRainbowMode, false);
resetButton.addEventListener("click", resetButtonPressed, false);
muteButton.addEventListener("click", muteButtonPressed, false);


/**
 * On mouse down over canvas
 */

function mouseDown() {
    console.log("Mouse Down");
    mouseDownPress = true;
}

/**
 * On mouse upo over canvas
 */

function mouseUp() {
    console.log("Mouse Up");
    mouseDownPress = false;
}


/**
 * Get cursor x and y positions on canvas
 * Set global position of x and y
 */
function getCursorPositionXY(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorXPosition = x;
    cursorYPosition = y;
}

/**
 * Display instructions modal
 */
function displayInstructions() {
    instructionsModal.style.display = "block";
}

/**
 * Close instructions modal
 */
function closeInstructions() {
    instructionsModal.style.display = "none";
}

/**
 * Update slider global values based on browser element
 * Execute change audio speed method
 */
function updateValues() {
    alignmentSliderVal = document.getElementById("alignment-slider").value;
    cohesionSliderVal = document.getElementById("cohesion-slider").value;
    separationSliderVal = document.getElementById("separation-slider").value;
    changeAudioSpeed();
}

/**
 * On More Birds Button press execute addBirds method
 */
function buttonMoreBirds() {
    addBirds();
}

/**
 * On Less Birds Button press execute removeBirds method
 * Remove with random range of 30 - 50 birds
 */
function buttonLessBirds() {
    removeBirds(Random.integer(30, 50));
}

/**
 * On Rainbow Mode Button press execute randomBirdsColourChange method
 */
function buttonRainbowMode() {
    randomBirdsColourChange();
}

/**
 * On reset button press execute reset method
 */
function resetButtonPressed() {
    reset();
}

/**
 * On mute button press execute muteAudio method
 */
function muteButtonPressed() {
    muteAudio();
}


/**
 * Timer to create new birds iteratively when mouse is held on canvas
 * Interval of 80ms set - runs continously from window load
 * Repeatedly calls mouseHoldBirds function, with a fixed time delay between each call. 
 */
window.setInterval(function () {
    if(mouseDownPress == true)
    {
        mouseHoldBirds(cursorXPosition,cursorYPosition);   
    }
}, 80);