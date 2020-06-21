import {Texture} from '../../../engine/index.js'
import {RARE_PROB_LEVEL_1} from '../../config/settings.js'

/**
 * This item decreases the light source ratio
 */
export class DarkRing {
  constructor(
      position = {x: 0, y: 0}, width = 24, height = 24, active = true,
      rarityClass = RARE_PROB_LEVEL_1) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.width = width;
    this.height = height;
    this.target = "light";
    this.texture = new Texture('../../../res/img/dark_ring.png', width, height);
  }

  /**
   * This function decreases the visible ratio of the light source by <value>
   * @param  {LightSource}  lightSource The light source in which the effect
   *     takes place
   * @param  {Number}       value The number to be subtracted to the visible
   *     ratio
   */
  applyEffect(lightSource, value = 5) {
    if (this.active) {
      lightSource.decreaseRatio(value);
    }
  }
}