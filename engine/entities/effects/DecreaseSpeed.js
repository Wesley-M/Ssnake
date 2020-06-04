export default class DecreaseSpeed {
    constructor(prob) {
        super();
        this.prob = prob;
    }

    /**
     * This function decreases the speed of the snake by <value>
     * @param  {Snake}  snake The snake in which the effect takes place 
     * @param  {Number} value The speed value to be subtracted
     */
    apply(snake, value = undefined) {
        const DEFAULT_VALUE = 4;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        if (snake.velocity > snake.MIN_SPEED)
            snake.velocity -= value;
    }
}