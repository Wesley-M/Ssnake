export default class Death {
    constructor(prob) {
        super();
        this.prob = prob;
    }

    /**
     * This function kills the snake
     * @param  {Snake} snake The snake in which the effect takes place 
     * @param  {None}  value Parameter to conform to the api (Maybe will be used in the future) 
     */
    apply(snake, value = undefined) {
        snake.die();
    }
}