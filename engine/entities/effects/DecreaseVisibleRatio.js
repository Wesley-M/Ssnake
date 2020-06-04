export default class DecreaseVisibleRatio {
    constructor(prob) {
        super();
        this.prob = prob;
    }

    /**
     * This function decreases the visible ratio of the grid by <value>
     * @param  {Grid}   grid The grid in which the effect takes place 
     * @param  {Number} value The number to be subtracted to the visible ratio in the grid
     */
    apply(grid, value = undefined) {
        const DEFAULT_VALUE = 3;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        if (grid.visible_ratio > grid.MIN_VISIBLE_RATIO)
            grid.visible_ratio -= value;
    }
}