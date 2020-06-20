import {Texture} from '../../../engine/index.js'
import {RARE_PROB_LEVEL_1} from '../../config/settings.js'

/**
 * This item decreases the speed of the snake
 */
export class Mushroom {
  constructor(
      position, width = 24, height = 24, active = true,
      rarityClass = RARE_PROB_LEVEL_1) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.width = width;
    this.height = height;
    this.target = 'snake';
    this.texture = new Texture('../../../res/img/mushroom.png', width, height);
  }

  /**
   * This function decreases the speed of the snake by <value>
   * @param  {Snake}  snake The snake in which the effect takes place
   * @param  {Number} value The speed value to be subtracted
   */
  applyEffect(snake, value = 0.5) {
    snake.decreaseSpeed(value);
  }
}