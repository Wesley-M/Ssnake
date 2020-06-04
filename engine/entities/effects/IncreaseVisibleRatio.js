export default class IncreaseVisibleRatio {
    constructor(prob) {
        super();
        this.prob = prob;
    }

    /**
     * This function increases the visible ratio of the grid by <value>
     * @param  {Grid}   grid The grid in which the effect takes place 
     * @param  {Number} value The default number of segments to be added to tail
     */
    apply(grid, value = undefined) {
        const DEFAULT_VALUE = 3;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        grid.visible_ratio += value;
    }
}