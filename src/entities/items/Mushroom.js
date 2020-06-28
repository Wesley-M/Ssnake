import {RARE_PROB_LEVEL_1} from '../../../engine/config/settings.js'
import {Item} from '../../../engine/index.js'

/**
 * This item decreases the speed of the snake
 */
export class Mushroom extends Item {
  constructor({position, width, height, active} = {}) {
    super({
      position: position, 
      width, 
      height, 
      active, 
      rarityClass: RARE_PROB_LEVEL_1, 
      targetName: 'snake',
      textureFilename: '../../../res/img/mushroom.png'
    });
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