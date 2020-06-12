/**
 * A light source that follows an object
*/
export class LightSource {
  /**
   * Creates an instance of LightSource.
   * @param {Object} obj The object that will be surrounded by the light
   * @param {number} ratio The ratio of light (expressed by a percentage
   *     of the canvas diagonal)
   * @memberof LightSource
   */
  constructor(obj, ratio) {
    this.obj = obj;
    this.position = {x: this.obj.position.x, y: this.obj.position.y};
    this.ratio = ratio;
  }

  /**
   * Update the position of the light
   */
  update() {
    this.position = {x: this.obj.position.x, y: this.obj.position.y};
  }
}