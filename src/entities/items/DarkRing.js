import {RARE_PROB_LEVEL_1} from '../../../engine/config/settings.js'
import {Item} from '../../../engine/index.js'

/**
 * This item decreases the light source ratio
 */
export class DarkRing extends Item {
  constructor({position, width, height, active} = {}) {
    super({
      position: position, 
      width, 
      height, 
      active, 
      rarityClass: RARE_PROB_LEVEL_1, 
      targetName: 'light',
      textureFilename: '../../../res/img/dark_ring.png'
    });
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