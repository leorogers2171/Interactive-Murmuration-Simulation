/**
 * Standard class to represent a 2D Vector, serving only some minimal functionality.
 *
 * A class to describe a two or three dimensional vector, specifically a Euclidean vector.
 *
 * A vector is an entity that has both magnitude and direction. The datatype, however stores the components of the vector (x, y for this 2d version).
 * The magnitude and direction can be accessed via the methods calculateMagnitude()
 *
 * Based on the P5 Libary - https://p5js.org/reference/#/p5.Vector/
 *
 */
class TwoDimensionalVector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds x, y, and z components to a vector.
     * The version of the method that adds two vectors together is a static method and returns a p5.Vector, the others acts directly on the vector. e.g
     * let v = createVector(1, 2, 3);
       v.add(4, 5, 6);
       v's components are set to [5, 7, 9]
     */
    add(addX, addY) {
        this.x = this.x + addX;
        this.y = this.y + addY;
    }

    /**
     * Subtract x and y from this vector's x and y values.
     *
     * subX the x to subtract from this vector's x val
     * subY the y to subtract from this vector's y val
     */
    sub(subX, subY) {
        this.x = this.x - subX;
        this.y = this.y - subY;
    }

    /**
     * Limit the magnitude of this vector to the value used for the max
     * parameter.
     */
    limit(max) {
        if (this.calculateMagnitude() > max) {
            this.setMagnitude(max);
        }
        return this;
    }

    /**
     * Divide the vector by a scalar and act on the vector directly.
     * Scalar div x and y by this.
     */
    div(scalar) {
        let dividedX = this.x / scalar;
        let dividedY = this.y / scalar;

        this.x = dividedX;
        this.y = dividedY;
    }


    /**
     *  Calculates the magnitude / length of the vector and returns the result as a float (this is simply the equation sqrt(x*x + y*y).)
     */
    calculateMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    /**
     * Set the magnitude of this vector to the value used for the len parameter
     * Len the magnitude of this vector to set.
     */
    setMagnitude(len) {
        this.normalise().multiply(len);
    }

    /**
     *
     * Returns {TwoDimensionalVector} with amended x and y
     */
    normalise() {
        let magnitude = this.calculateMagnitude();
        if (magnitude !== 0) this.multiply(1 / magnitude);
        return this;
    }

    /**
     * Multiply x and y values of this vector by param number
     * @param scalar the number to multiply x and y values of this vector by
     */
    multiply(scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar
    }
    
    //The euclidean distance between two vectors (considered as points)
    //Used to measure the distance between two points in 2D
    static distance(x, y, otherX, otherY) {
        var dist = Math.sqrt( Math.pow((x-otherX), 2) + Math.pow((y-otherY), 2) );
        return dist;
    }

    /**
     * Instantiate a pseudorandom number between 0 and 1 for both the x and the y.
     * Returns {TwoDimensionalVector}
     */
    static createRandom2DVector() {
         return new TwoDimensionalVector(Math.random()*2-1, Math.random()*2-1);
    }

    /**
     * Calculates the squared magnitude of the vector and returns the result
     * as a float (this is simply the equation (x*x + y*y).)
     *
     * Returns {number}
     */
    magnitudeSquared() {
        let xSquared = this.x * this.x;
        let ySquared = this.y * this.y;

        return xSquared + ySquared;
    }
}
