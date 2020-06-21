import {Texture} from '../../../engine/index.js'
import {NORMAL_PROB} from '../../config/settings.js'

/**
 * This item feeds the snake
 */
export class Food {
  constructor(
      position = {x: 0, y: 0}, width = 24, height = 24, active = true,
      rarityClass = NORMAL_PROB) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.width = width;
    this.height = height;
    this.target = 'snake';
    this.texture = new Texture('../../../res/img/meat.png', width, height);
  }

  /**
   * This function appends <value> segments to the snake body
   * @param  {Snake}  snake The snake in which the effect takes place
   * @param  {Number} value The number of segments to be added to the snake tail
   */
  applyEffect(snake, value = 5) {
    snake.eat(value);
  }
}