import {Loader} from '../../engine/utils/Loader.js';
import {ItemSelector} from './items/selector/ItemSelector.js'

export class Map {
  constructor(w, h, level, camera) {
    this.items = [];
    this.w = w;
    this.h = h;
    this.level = level;
    this.hasLoaded = false;
    this.margin = 50;
    this.camera = camera;
    this.walls = [];
  }

  load() {
    const loader = new Loader();
    loader.loadJson(`src/maps/${this.level}/map.json`).then(json => {
      this.tilemap = json;
      loader.loadImage(`src/maps/${this.level}/sprite_sheet.png`).then(img => {
        this.placeObjects();
        this.tilesheet = img;
        this.hasLoaded = true;
      });
    });

    return new Promise((resolve, reject) => {
      const id = setInterval(() => {
        if (this.hasLoaded) {
          clearInterval(id);
          resolve(this);
        }
      }, 100);
    });
  }

  placeObjects() {
    // Getting a map from names to ids
    const layerId = {};
    this.tilemap.layers.forEach((layer, index) => {
      layerId[layer.name] = index;
    });

    const layer = layerId['trigger'];
    
    if (this.tilemap.layers[layer]) {
      this.tilemap.layers[layer].objects.forEach((obj) => {
        this.walls.push(obj);
      });
    }
  }

  update() {
    // TODO: Spawning time to new item (a little randomly)

    // let inactiveItemIndexes = this.items.reduce((acc, item, index) => {
    //   if (!item.active) acc.push(index);
    //   return acc;
    // }, []);

    // inactiveItemIndexes.forEach(index => {
    //   this.items.splice(index, 1);
    // });

    // if (this.items.length < this.minItems) {
    //   this.placeItems(this.minItems - this.items.length);
    // }
  }
}
