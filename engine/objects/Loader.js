/**
 * Knows how to load all the games resources
 */
export class Loader {

  /**
   * Load a json file as an object
   *
   * @param {string} path The path to the json
   * @returns A promise to a json object
   * @memberof Loader
   */
  async loadJson(path) {
    let fetchJson = await fetch(path); 
    let json = await fetchJson.json();
    return json; 
  }

  /**
   * Load an image
   *
   * @param {string} path The path to the json
   * @returns A promise to an image
   * @memberof Loader
   */
  loadImage(path) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.src = path;
    });
  }
}