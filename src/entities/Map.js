import {Loader} from '../../engine/utils/Loader.js';
import {ItemSelector} from './items/selector/ItemSelector.js'

export class Map {
  constructor(w, h, level, camera) {
    this.initialSnakePosition = {x: 0, y: 0};
    this.w = w;
    this.h = h;
    this.level = level;
    this.margin = 50;
    this.hasLoaded = false;
    
    this.items = [];
    this.itemSlots = [];
    this.minItems = 5;
    this.walls = [];
    
    this.camera = camera;
    this.zoom = 20;
  
  }

  load() {
    const loader = new Loader();
    loader.loadJson(`src/maps/${this.level}/map.json`).then(json => {
      this.tilemap = json;
      loader.loadImage(`src/maps/${this.level}/sprite_sheet.png`).then(img => {
        this.loadObjects();
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

  loadObjects() {
    // Getting a map from names to ids
    const layerId = {};
    this.tilemap.layers.forEach((layer, index) => {
      layerId[layer.name] = index;
    });

    const layer = layerId['trigger'];
    
    if (this.tilemap.layers[layer]) {
      this.tilemap.layers[layer].objects.forEach((obj) => {
        
        // Apply zoom in the object
        this.adjustObjScale(obj);
        
        switch(obj.name) {
          case 'isInitialPosition':
            this.initialSnakePosition = { 
              x: obj.x + (obj.width / 2),
              y: obj.y + (obj.height / 2)
            };
            break;
          case 'Wall':
            this.walls.push(obj);
            break;
          case 'itemSlot':
            this.itemSlots.push(obj);
            break;
          default:
        }
      });
    }
  }

  placeItems() {
    const selector = new ItemSelector();
    let itemsToBeCreated = Math.abs(this.items.length - this.minItems);
    while (itemsToBeCreated > 0) {
      const randomIndex = Math.floor(Math.random() * this.itemSlots.length);
      let slot = this.itemSlots[randomIndex];
      let item = selector.getItem();
      console.log(item);
      item.position.x = slot.x;
      item.position.y = slot.y;
      this.items.push(item);
      itemsToBeCreated = this.items.length - this.minItems;
    }
  }

  adjustObjScale(obj) {
    obj.width += (obj.width / 16) * this.zoom;
    obj.height += (obj.height / 16) * this.zoom;
    obj.y += (obj.y / 16) * this.zoom;
    obj.x += (obj.x / 16) * this.zoom;
  }

  update(dt, t) {
    // TODO: Spawning time to new item (a little randomly)

    let inactiveItemIndexes = this.items.reduce((acc, item, index) => {
      if (!item.active) acc.push(index);
      return acc;
    }, []);

    inactiveItemIndexes.forEach(index => {
      this.items.splice(index, 1);
    });

    this.placeItems();
  }
}
