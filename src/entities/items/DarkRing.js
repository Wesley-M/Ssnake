import { Texture } from '../../../engine/index.js'
import { RARE_PROB_LEVEL_1 } from '../../config/settings.js'

/**
 * This item decreases the light source ratio
 */
export class DarkRing {
  constructor(
      position = {x: 0, y: 0}, active = true, rarityClass = RARE_PROB_LEVEL_1) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.texture = new Texture('../../../res/img/dark_ring.png');
  }

  /**
   * This function decreases the visible ratio of the light source by <value>
   * @param  {LightSource}  lightSource The light source in which the effect
   *     takes place
   * @param  {Number}       value The number to be subtracted to the visible
   *     ratio
   */
  applyEffect(lightSource, value = 10) {
    if (this.active) {
      lightSource = Math.max(lightSource.minRatio, lightSource.ratio - value);
    }
  }
}