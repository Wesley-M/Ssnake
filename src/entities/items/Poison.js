import {Texture} from '../../../engine/index.js'
import {RARE_PROB_LEVEL_1} from '../../config/settings.js'

/**
 * This item decreases the speed of the snake
 */
export class Poison {
  constructor(
      position, width = 24, height = 24, active = true,
      rarityClass = RARE_PROB_LEVEL_1) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.width = width;
    this.height = height;
    this.target = 'snake';
    this.texture = new Texture('../../../res/img/green_flask.png', width, height);
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