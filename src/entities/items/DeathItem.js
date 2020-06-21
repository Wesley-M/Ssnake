import {Texture} from '../../../engine/index.js'
import {RARE_PROB_LEVEL_2} from '../../config/settings.js'

/**
 * This item kills the snake
 */
export class DeathItem {
  constructor(
      position = {x: 0, y: 0}, width = 24, height = 24, active = true,
      rarityClass = RARE_PROB_LEVEL_2) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.width = width;
    this.height = height;
    this.target = 'snake';
    this.texture = new Texture('../../../res/img/skull.png', width, height);
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