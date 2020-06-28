import {RARE_PROB_LEVEL_2} from '../../../engine/config/settings.js'
import {Item} from '../../../engine/index.js'

/**
 * This item increases the speed of the snake
 */
export class SpeedFlower extends Item {
  constructor({position, width, height, active} = {}) {
    super({
      position: position, 
      width, 
      height, 
      active, 
      rarityClass: RARE_PROB_LEVEL_2, 
      targetName: 'snake',
      textureFilename: '../../../res/img/speed_flower.png'
    });
  }

  /**
   * This function increases the speed of the snake by <value>
   * @param  {Snake}  snake The snake in which the effect takes place
   * @param  {Number} value The speed value to be added
   */
  applyEffect(snake, value = 0.5) {
    snake.increaseSpeed(value);
  }
}