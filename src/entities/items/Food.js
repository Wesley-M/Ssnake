import SsnakeEngine from "../../../engine/index.js"
import { NORMAL_PROB } from "../../config/settings.js"

const { Texture } = SsnakeEngine;

/** 
 * This item feeds the snake
*/
export default class Food {
    constructor(position, active = true, rarityClass = NORMAL_PROB) {
        this.rarityClass = rarityClass;
        this.active = active;
        this.position = position;
        this.texture = new Texture("../../../res/img/meat.png");
    }

    /**
     * This function appends <value> segments to the snake body
     * @param  {Snake}  snake The snake in which the effect takes place 
     * @param  {Number} value The number of segments to be added to the snake tail
     */
    applyEffect(snake, value) {
        const DEFAULT_VALUE = 3;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        snake.eat(value);
    }
}