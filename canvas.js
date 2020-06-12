const allBirds = []; //Live birds array

const refreshDelayMs = 10; //Refresh delay of canvas

let mouse = false; //Check if mouse hold is active

let alignmentSliderVal, cohesionSliderVal, separationSliderVal; //Global slider values
let rainbowActive = false;
let muteActive = false;
let audioMuteFirst = false;

var birdsAudio = document.createElement('audio'); //Creating audio element
birdsAudio.src = 'sounds/starling-flying-sound.mp3'; //Setting audio element file path
birdsAudio.loop = true; //Loop audio file indefinitely 

/**
 * Initialise the birds and add to canvas ready to be manipulated by draw function.
 */
function init() {
    //Setting inital slider values
    alignmentSliderVal = document.getElementById("alignment-slider").value;
    cohesionSliderVal = document.getElementById("cohesion-slider").value;
    separationSliderVal = document.getElementById("separation-slider").value;
    
    let flockSize = 300; //Size of flock to render on canvas
    
    for (let i = 0; i < flockSize; i++) {
        let bird = new Bird(); // Create a standard bird
        isRed = (Math.random() > 0.90); //10% of birds set to red
        isYellow = (Math.random() > 0.90); //10% of birds set to yellow
        
        if (isRed){
            bird.setColour("red");
        }
        else if (isYellow) {
            bird.setColour("yellow");
        }
        allBirds.push(bird);//Add to the flock
    }
}

/**
 * Add random amount of birds to the allBirds array (10 - 30)
 */
function addBirds() {
    let flockSize = Random.integer(10, 30); //Random whole number (10 - 30)
    
    for (let i = 0; i < flockSize; i++) {
        let bird = new Bird(); //Create new bird
        bird.setColour("orange"); //Set birds colour
        allBirds.push(bird); //Add bird to array
    }
}

/**
 * Remove birds from array at random positions in the array
 */
function removeBirds(flockRemoveSize) {
    let birdsArrayLength = Object.keys(allBirds).length; //Set array length to num of items
    
    for (let i = 0; i < flockRemoveSize; i++) {
        //Remove item from array at random position
        allBirds.splice((Random.integer(0,birdsArrayLength)), 1); 
    }
}

/**
 * Remove birds from array at random positions in the array
 */
function randomBirdsColourChange() {
    if(!rainbowActive) {
        rainbowActive = true; //Button set to activated
        let birdsArrayLenght = Object.keys(allBirds).length; //Set array length to num of items
        for (let bird of allBirds) {
            //Iterate through flock and set bird to a random colour value
            bird.setRandomColour(); 
        }
    }
    else{
        rainbowActive = false; //Button set to de-activated
        revertToNormalColourSystem(); //Set normal colour system
    }
}

/**
 * Change birds colours to default colour allocation
 */
function revertToNormalColourSystem() {
    let birdsArrayLenght = Object.keys(allBirds).length; //Set array length to num of items
    for (let bird of allBirds) {
        //Iterate through all birds
        isRed = (Math.random() > 0.90); //10% of birds set to red
        isYellow = (Math.random() > 0.90); //10% of birds set to yellow
        
        if (isRed){
            bird.setColour("red"); //Set birds colour to red
        }
        else if (isYellow) {
            bird.setColour("yellow"); //Set birds colour to yellow
        }
        else {
            bird.setColour("white"); //Set birds colour to white
        }
    }
}

/**
 * Trigger creation of new bird based on mouse x and y values
 */
function mouseHoldBirds(mouseX, mouseY) {
    birdsAudio.play(); //Start audio trigger 
    let bird = new Bird(); // Create a standard bird
    bird.setColour("red"); //Set birds colour to red
    bird.x = mouseX; //Mouse X value
    bird.y = mouseY; //Mouse Y value
    allBirds.push(bird); //Add bird to array
}
    
/**
 * Iterate through all birds and change various properties about them.
 */
function redrawBirds() {

    // Tear down the canvas ready to redraw
    tearDownCanvas();

    // Redraw the canvas taking into account locational bird info.
    for (let bird of allBirds) {
        bird.handleXOverflow(); //Move birds with x > canvas width
        bird.handleYOverflow(); //Move birds with y > canvas width

        bird.flock(allBirds); //Add bird to array

        bird.doVelocities(); //Calc velocities
        bird.persistToCanvas(); //Add to canvas
    }
}

/**
 * Clear the canvas
 */
function tearDownCanvas() {
    twoDCanvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Change the audio speed based on the alignment sliders value
 */
function changeAudioSpeed() {
    let birdsPlaybackSpeed = 1; //Audio playback speed
    let audioVolume = 1; //Audio playback volume
    
    if (alignmentSliderVal <= 1) //Slider val < 1
    {
        //Set playback speed and volume
        birdsPlaybackSpeed = alignmentSliderVal;
        audioVolume = alignmentSliderVal/15;
    }
    else{
        //Set playback speed and volume
        birdsPlaybackSpeed = alignmentSliderVal * (alignmentSliderVal * 4);
        audioVolume = alignmentSliderVal/10;
    }
    
    birdsAudio.playbackRate = birdsPlaybackSpeed; //Set audio element playback rate
    birdsAudio.volume = audioVolume; //Set audio element volume
}

/**
 * Mute audio element
 */
function muteAudio() {
    if (!muteActive) {
        muteActive = true;
        birdsAudio.pause(); //Pause audio
    }
    else{
        muteActive = false;
        birdsAudio.play(); //Play audio
    }
}

/**
 * Reset entire canvas: birds and sliders
 */
function reset() {
    removeBirds(Object.keys(allBirds).length); //Remove all birds
    init(); //Initialise canvas
    redrawBirds(); //Draw birds again
    revertToNormalColourSystem(); //Set colours to default colour system
    
    //Set slider values to deafult
    document.getElementById("alignment-slider").value = 1; 
    document.getElementById("cohesion-slider").value = 1; 
    document.getElementById("separation-slider").value = 0.7;
    alignmentSliderVal = 1;
    cohesionSliderVal = 1;
    separationSliderVal = 0.7;
}

/**
 * Every 10 milliseconds, update the canvas.
 */
window.setInterval(function () {
    //Execute canvas refresh and draw brids
    //Else log error
    try {
        redrawBirds();
        console.log("Canvas refresh successful.");
    } catch (e) {
        console.error("We couldn't refresh the canvas. ", e.stackTrace)
    }
}, refreshDelayMs);

init();
redrawBirds();