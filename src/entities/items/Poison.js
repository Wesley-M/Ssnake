import { Texture } from '../../../engine/index.js'
import { RARE_PROB_LEVEL_1 } from '../../config/settings.js'

/**
 * This item decreases the speed of the snake
 */
export class Poison {
  constructor(position, active = true, rarityClass = RARE_PROB_LEVEL_1) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.texture = new Texture('../../../res/img/green_flask.png');
  }

  /**
   * This function subtracts <value> segments of the snake body
   * @param  {Snake}  snake The snake in which the effect takes place
   * @param  {Number} value The number of segments to be subtracted from the
   *     tail
   */
  applyEffect(snake, value = 3) {
    snake.reduce(value);
  }
}