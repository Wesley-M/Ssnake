import {NORMAL_PROB} from '../../../engine/config/settings.js'
import {Item} from '../../../engine/index.js'

/**
 * This item feeds the snake
 */
export class Food extends Item {
  constructor({position, width, height, active} = {}) {
    super({
      position: position, 
      width, 
      height, 
      active, 
      rarityClass: NORMAL_PROB, 
      targetName: 'snake',
      textureFilename: '../../../res/img/meat.png'
    });
  }

  /**
   * This function appends <value> segments to the snake body
   * @param  {Snake}  snake The snake in which the effect takes place
   * @param  {Number} value The number of segments to be added to the snake tail
   */
  applyEffect(snake, value = 20) {
    snake.eat(value);
  }
}