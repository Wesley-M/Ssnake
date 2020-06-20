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
    this.position = {
      x: this.obj.position.x - this.obj.camera.x,
      y: this.obj.position.y - this.obj.camera.y
    };
    this.ratio = ratio;
    this.minRatio = 5;
  }

  increaseRatio(value) {
    this.ratio = Math.min(this.ratio + value, 100);
  }

  decreaseRatio(value) {
    this.ratio = Math.max(this.minRatio, this.ratio - value);
  }

  /**
   * Update the position of the light
   */
  update() {
    this.position = {
      x: this.obj.position.x - this.obj.camera.x,
      y: this.obj.position.y - this.obj.camera.y
    };
  }
}