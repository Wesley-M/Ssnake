export default class AddSegments {
    constructor(prob) {
        super();
        this.prob = prob;
    }

    /**
     * This function appends <value> segments to the snake body
     * @param  {Snake}  snake The snake in which the effect takes place 
     * @param  {Number} value The number of segments to be added to tail
     */
    apply(snake, value) {
        const DEFAULT_VALUE = 3;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        for (let i = 0; i < value; i++) snake.appendToTail();
    }
}