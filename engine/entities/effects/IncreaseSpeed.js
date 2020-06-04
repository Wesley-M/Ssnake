export default class IncreaseSpeed {
    constructor(prob) {
        super();
        this.prob = prob;
    }

    /**
     * This function increases the speed of the snake by <value>
     * @param  {Snake}  snake The snake in which the effect takes place 
     * @param  {Number} value The speed value to be added
     */
    apply(snake, value = undefined) {
        const DEFAULT_VALUE = 4;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        snake.speed += value;
    }
}