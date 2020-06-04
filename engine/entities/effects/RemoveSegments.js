export default class RemoveSegments {
    constructor(prob) {
        super();
        this.prob = prob;
    }

    /**
     * This function subtracts <value> segments of the snake body
     * @param  {Snake}  snake The snake in which the effect takes place 
     * @param  {Number} value The number of segments to be subtracted from the tail
     */
    apply(snake, value = undefined) {
        const DEFAULT_VALUE = 3;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        for (let i = 0; i < value; i++) {
            if (snake.length > snake.INITIAL_SNAKE_LENGTH) {
                snake.removeFromTail();
            }
        }
    }
}