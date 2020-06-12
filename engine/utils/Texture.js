/**
 * Represents the textures
 * @export
 * @class Texture
 */
export class Texture {
  /**
   * Creates an instance of Texture.
   * @param {string} filename The image filename 
   * @memberof Texture
   */
  constructor(filename) {
    this.img = new Image();
    this.img.src = filename;
  }
}