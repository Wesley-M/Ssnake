export class Loader {
  constructor(resources_number) {
    this.resources_number = resources_number;
    this.resources_loaded = 0;
  }

  async loadJson(path) {
    let fetchJson = await fetch(path); 
    let json = await fetchJson.json();
    return json; 
  }

  loadImage(path) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.src = path;
    });
  }
}