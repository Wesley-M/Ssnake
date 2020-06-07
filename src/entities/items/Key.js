import SsnakeEngine from '../../../engine/index.js'
import {RARE_PROB_LEVEL_3} from '../../config/settings.js'

const {Texture} = SsnakeEngine;

/**
 * This item represents a key that will be given to the snake
 */
export default class Key {
  constructor(position, active = true, rarityClass = RARE_PROB_LEVEL_3) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.texture = new Texture('../../../res/img/key.png');
  }

  /**
   * This function gives the snake a key
   * @param  {Snake} snake The snake in which the effect takes place
   * @param  {None}  value Parameter to conform to the api (Maybe will be used
   *     in the future)
   */
  applyEffect(snake, value = undefined) {
    snake.takeKey();
  }
}