import { Texture } from '../../../engine/index.js'
import { RARE_PROB_LEVEL_1 } from '../../config/settings.js'

/**
 * This item decreases the speed of the snake
 */
export class Mushroom {
  constructor(position, active = true, rarityClass = RARE_PROB_LEVEL_1) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.texture = new Texture('../../../res/img/mushroom.png');
  }

  /**
   * This function decreases the speed of the snake by <value>
   * @param  {Snake}  snake The snake in which the effect takes place
   * @param  {Number} value The speed value to be subtracted
   */
  applyEffect(snake, value = 4) {
    snake.velocity = Math.max(snake.minSpeed, snake.velocity - value)
  }
}