//Use DOM to define the canvas and content
const canvas = document.getElementById('my-canvas'); //Retrieve by ID
const twoDCanvasContext = canvas.getContext('2d');  //Get 2D content from canvas

/**
 * Class to represet a birds properties
 *
 * Stores parameters related to the flocking simulation
 * Performs acceleration calculations using seperation, cohesion, alignment
 *
 */
class Bird {
    /**
     * Parameters that define the bird object construction
     */
    constructor() {
        this.x = Random.integer(1, canvas.width);//Position on canvas width
        this.y = Random.integer(1, canvas.height);//Position on canvas height
        this.radius = 4; //Radius of the canvas circle
        this.velocity = TwoDimensionalVector.createRandom2DVector(); //Velocity set as 2D vector
        this.velocity.setMagnitude(Random.float(1, 4)); //Random positive/negative velocity
        this.colour = "white"; //Colour
        this.acceleration = TwoDimensionalVector.createRandom2DVector(); //Acceleration set as 2D vector
        this.maxForce = 4; // Maximum steering force
        this.maxSpeed = 1; // Maximum speed
    }

    /**
     * Alignment
     * 'Steer towards the average heading of local flockmates'
     * For every nearby boid in the system, calculate the average velocity
     */
    align(birds) {
        // Only amend this bird's steering if it is less than the specified value.
        let vision = 50; //Perception radius in front
        let steering = TwoDimensionalVector.createRandom2DVector();
        let changes = 0; //Total of how many birds
        
        //Iterate through birds
        for (let other of birds) {
            if (other === this) continue;
            
            let dist = TwoDimensionalVector.distance(this.x, this.y, other.x, other.y); //Calculates the distance between two points, in two dimensions
            
            //If the distance is less than an arbitrary amount
            if (dist < vision) {
                steering.add(other.velocity.x, other.velocity.y); 
                changes++; //Keep track of how many birds
            }
        }
        
        if (changes > 0) {
            steering.div(changes); // Average - divide by how many
            steering.setMagnitude(this.maxSpeed); //Set the magnitude of vector to maximum speed value
            steering.sub(this.velocity.x, this.velocity.y); //Subtract velocity position x and y from vector
            steering.limit(this.maxForce); //Limit the magnitude of the vector to maximum force value
        }
        return steering; //Return 2D vector
    }
    
    /**
     * Seperation
     * 'Steer to avoid crowding local flockmates'
     * Method checks for nearby boids and steers away
     */
    seperation(birds) {
        // Only amend this bird's steering if it is less than the specified value.
        let vision = 50; //Perception radius in front
        let steering = new TwoDimensionalVector(0, 0); //Declare 2D vector with x and y values
        let changes = 0; //Total of how many birds
        
        //Iterate through birds
        for (let other of birds) {
            if (other === this) continue;
            let dist = TwoDimensionalVector.distance(this.x, this.y, other.x, other.y); //Calculates the distance between two points, in two dimensions
            
            //If the distance is less than the defined perception radius
            if (dist < vision) {
                let diff = new TwoDimensionalVector(0, 0); //Declare 2D vector with x and y values
                //Calc difference in x and y positions
                diff.x = this.x - other.x; 
                diff.y = this.y - other.y

                diff.div(dist * dist); //Weight by distance
                steering.add(other.x, other.y) //Add other position to steering
                steering.sub(this.x, this.y) //Subtract this position from steering
            }
        }
        return steering; //Return 2D Vector
    }
    
    /**
     * Cohesion
     * 'Steer to move toward the average position of local flockmates'
     * For the average position of all nearby boids, calculate steering vector towards that position
     */
    cohesion(birds) {
        let vision = 100; //Perception radius in front
        let steering = TwoDimensionalVector.createRandom2DVector(); //Declare 2D vector
        let changes = 0; //Total of how many birds
        
         //Iterate through birds
        for (let other of birds) {
            if (other === this) continue;
            let dist = TwoDimensionalVector.distance(this.x, this.y, other.x, other.y); //Calculates the distance between two points, in two dimensions
            
            //If the distance is less than the defined perception radius
            if (dist < vision) {
                steering.add(other.x, other.y); //Add other position to sterring
                changes ++; //Keep track of how many birds
            }
        }

        if (changes > 0) {
            steering.div(changes); // Average - divide by how many
            steering.sub(this.x, this.y); //Subtract this position x and y from vector
            steering.setMagnitude(this.maxSpeed); //Set the magnitude of vector to maximum speed value
            steering.sub(this.velocity.x, this.velocity.y); //Subtract velocity position x and y from vector
            steering.limit(this.maxForce) //Limit the magnitude of the vector to maximum force value
        }
        return steering;
    }
    
    /**
     * Method to set bird acceleration
     * We accumulate a new acceleration each time based on alignment, cohesion, seperation
     * Set acceleration based on slider values
     */
    flock(birds) {   
        let alignment = this.align(birds);
        let cohesion = this.cohesion(birds);
        let seperation = this.seperation(birds);
        
        this.maxSpeed = alignmentSliderVal; //Max speed of all birds is equal to the alignment slider value
        //Multpily cohesion and seperation vectors by slider value
        cohesion.multiply(cohesionSliderVal);
        seperation.multiply(separationSliderVal);
        
        //Add acceleration based on rules
        this.acceleration.add(alignment.x, alignment.y);
        this.acceleration.add(cohesion.x, cohesion.y)
        this.acceleration.add(seperation.x, seperation.y);
    }
    
    /**
     * Method to update position
     * Update and calculate velocities
     */
    doVelocities() {
        this.x += this.velocity.x; //X value equal to velocity x value
        this.y += this.velocity.y //Y value equal to velocity y value
        this.velocity.add(this.acceleration.x, this.acceleration.y);
        this.velocity.limit(this.maxSpeed); //Limit velocities magnitude to the maximum speed
    }
    
    /**
     * Method to update position
     * Update and calculate velocities
     */
    persistToCanvas() {
        twoDCanvasContext.beginPath(); //Clears the current internal path object and its sub-paths
        
        //Creates a circular arc centered at (x, y) with a radius of radius. 
        //The path starts at startAngle, ends at endAngle
        twoDCanvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        twoDCanvasContext.fillStyle = this.colour; //Set arc to have fill colour
        twoDCanvasContext.fill(); //Fills the given path with the current fillStyle
    }
    
    /**
     * Method to stop Y overflow
     * Change Y position of birds that > canvas height
     * Change overflow position back to 0
     */
    handleYOverflow() {
        //Canvas heigh in PX
        if (this.y > canvas.height) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = canvas.height;
        }
    }
    
    /**
     * Method to stop X overflow
     * Change X position of birds that > canvas width
     * Change overflow position back to 0
     */
    handleXOverflow() {
        //Canvas width in PX
        if (this.x > canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width;
        }
    }
    
    /**
     * Method to set bird colour property
     */
    setColour(colour) {
        this.colour = colour;
    }
    
    /**
     * Method to set bird to a random colour
     * Sets to random HEX value
     */
    setRandomColour() {
        var letters = '0123456789ABCDEF';
        var randomColor = '#';
        for (var i = 0; i < 6; i++) {
            randomColor += letters[Math.floor(Math.random() * 16)];
        }
        this.colour = randomColor; //Set colour to random color
    }
}



/**
 * Class to calculate random values
 * Calculates floats and integers with given parameters
 */
class Random {
    //Calculate random float in specified range
    static float(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    //Calculate random integer in specified range
    static integer(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}