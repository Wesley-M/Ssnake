import {RARE_PROB_LEVEL_2} from '../../../engine/config/settings.js'
import {Item} from '../../../engine/index.js'

/**
 * This item kills the snake
 */
export class DeathItem extends Item {
  constructor({position, width, height, active} = {}) {
    super({
      position: position, 
      width, 
      height, 
      active, 
      rarityClass: RARE_PROB_LEVEL_2, 
      targetName: 'snake',
      textureFilename: '../../../res/img/skull.png'
    });
  }

  /**
   * This function kills the snake
   * @param  {Snake} snake The snake in which the effect takes place
   * @param  {None}  value Parameter to conform to the api (Maybe will be used
   *     in the future)
   */
  applyEffect(snake, value = undefined) {
    snake.die();
  }
}