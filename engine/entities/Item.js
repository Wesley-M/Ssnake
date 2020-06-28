import {Texture} from '../objects/Texture.js'
import {NORMAL_PROB} from '../config/settings.js'

/**
 * This item decreases the light source ratio
 */
export class Item {
  constructor({
    position, 
    width = 24, 
    height = 24, 
    active = true, 
    rarityClass = NORMAL_PROB,
    targetName,
    textureFilename
  }={}){
    this.position = (position) ? position : {x: 0, y: 0};
    this.rarityClass = rarityClass;
    this.active = active;
    this.width = width;
    this.height = height;
    this.target = targetName;
    this.texture = new Texture(textureFilename, width, height);
  }

  /**
   * This function apply an effect 
   * @param  {!Object} target The object that will suffer change  
   * @param  {!Object} value A value that will be applied in the target.
   */
  applyEffect(target, value) {}
}