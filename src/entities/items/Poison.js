import {RARE_PROB_LEVEL_1} from '../../../engine/config/settings.js'
import {Item} from '../../../engine/index.js'

/**
 * This item decreases the speed of the snake
 */
export class Poison extends Item {
  constructor({position, width, height, active} = {}) {
    super({
      position: position, 
      width, 
      height, 
      active, 
      rarityClass: RARE_PROB_LEVEL_1, 
      targetName: 'snake',
      textureFilename: '../../../res/img/green_flask.png'
    });
  }

  /**
   * This function subtracts <value> segments of the snake body
   * @param  {Snake}  snake The snake in which the effect takes place
   * @param  {Number} value The number of segments to be subtracted from the
   *     tail
   */
  applyEffect(snake, value = 30) {
    snake.starve(value);
  }
}