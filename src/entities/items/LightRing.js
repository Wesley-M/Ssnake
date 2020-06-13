import { Texture } from '../../../engine/index.js'
import { RARE_PROB_LEVEL_1 } from '../../config/settings.js'

/**
 * This item increases the light source ratio
 */
export class LightRing {
  constructor(position, active = true, rarityClass = RARE_PROB_LEVEL_1) {
    this.rarityClass = rarityClass;
    this.active = active;
    this.position = position;
    this.texture = new Texture('../../../res/img/light_ring.png');
  }

  /**
   * This function increases the visible ratio of the light source by <value>
   * @param  {LightSource}  lightSource The light source in which the effect
   *     takes place
   * @param  {Number}       value The number to be added to the visible ratio
   */
  applyEffect(lightSource, value = 10) {
    if (this.active) {
      lightSource = Math.min(lightSource.ratio + value, 100)
    }
  }
}