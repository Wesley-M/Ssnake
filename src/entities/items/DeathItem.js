import SsnakeEngine from "../../../engine/index.js"
import { RARE_PROB_LEVEL_2 } from "../../config/settings.js"

const { Texture } = SsnakeEngine;

/** 
 * This item kills the snake
*/
export default class DeathItem {
    constructor(position, active = true, rarityClass = RARE_PROB_LEVEL_2) {
        this.rarityClass = rarityClass;
        this.active = active;
        this.position = position;
        this.texture = new Texture("../../../res/img/skull.png");
    }

    /**
     * This function kills the snake
     * @param  {Snake} snake The snake in which the effect takes place 
     * @param  {None}  value Parameter to conform to the api (Maybe will be used in the future) 
     */
    applyEffect(snake, value = undefined) {
        snake.die();
    }
}