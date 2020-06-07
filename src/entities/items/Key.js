import { Texture } from '../../../engine/index.js'

/**
 * This item represents a key that will be given to the snake
 */
export class Key {
  constructor(position, active = true, rarityClass = undefined) {
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