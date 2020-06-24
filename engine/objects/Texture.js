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
  constructor(filename, width, height) {
    this.img = new Image();
    this.img.src = filename;
    if (width != undefined) this.img.width = width;
    if (height != undefined) this.img.height = height;
  }
}