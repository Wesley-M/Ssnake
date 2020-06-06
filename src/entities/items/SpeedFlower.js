import SsnakeEngine from "../../../../engine/index.js"
import { RARE_PROB_LEVEL_2 } from "../../config/settings.js"

const { Texture } = SsnakeEngine;

/** 
 * This item increases the speed of the snake
*/
export default class SpeedFlower {
    constructor(position, active = true, rarityClass = RARE_PROB_LEVEL_2) {
        this.rarityClass = rarityClass;
        this.active = active;
        this.position = position;
        this.texture = new Texture("../../../res/img/speed_flower.png");
    }

    /**
     * This function increases the speed of the snake by <value>
     * @param  {Snake}  snake The snake in which the effect takes place 
     * @param  {Number} value The speed value to be added
     */
    applyEffect(snake, value = undefined) {
        const DEFAULT_VALUE = 4;
        
        if (value == undefined) 
            value = DEFAULT_VALUE;

        if (snake.velocity > snake.MIN_SPEED)
            snake.velocity += value;
    }
}