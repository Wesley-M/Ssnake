import {ItemSelector} from '../objects/ItemSelector.js'

/**
 * Represents a map that has all the information needed to place player and
 * items.
 *
 * @export
 * @class Map
 */
export class Map {
  /**
   *Creates an instance of Map.
   * @param {number} w Map width
   * @param {number} h Map height
   * @param {!Camera} camera Game camera
   * @param {string} level Map level
   * @param {!Object} itemsDomain It represents all the possible items to spawn
   * @param {number} [zoom=15]
   * @memberof Map
   */
  constructor(w, h, camera, level, allItems, itemsDomain, zoom = 15) {
    this.w = w;
    this.h = h;
    this.level = level;
    this.initialPlayerPosition = {x: 0, y: 0};
    
    this.selector = new ItemSelector(allItems, itemsDomain);
    this.itemSlots = [];
    this.items = [];
    this.minItems = 5;

    this.camera = camera;
    this.zoom = zoom;
    this.walls = [];

    this.tilesheet = null;
    this.tilemap = null;
    this.hasLightSource = null;

    this.hasLoaded = false;
  }

  /**
   * Loads all the objects into the map.
   * @memberof Map
   */
  load() {
    this.tilemap.layers.forEach((layer, index) => {
      // It selects the object layers from the tilemap exported by the 'tiled'
      // application to load the objects into the map.
      if (layer.type === 'objectgroup') {
        layer.objects.forEach(obj => {
          // Apply zoom in the object.
          this.scale(obj);
          switch (obj.name) {
            case 'isInitialPosition':
              this.setInitialPlayerPosition(obj);
              break;
            case 'Wall':
              this.addWall(obj);
              break;
            case 'itemSlot':
              this.addItemSlot(obj);
              break;
            default:
          }
        });
      }
    });
  }

  getTilemapProp(propName) {
    let [property] = this.tilemap.properties
                              .filter(prop => prop.name === propName);
    return property.value;
  }

  /**
   * It scales the object dimension and coordinate based on the zoom property
   * @param {!Object} obj An object with dimension and coordinate
   * @memberof Map
   */
  scale(obj) {
    const tileWidth = this.tilemap.tilewidth;
    obj.width += (obj.width / tileWidth) * this.zoom;
    obj.height += (obj.height / tileWidth) * this.zoom;
    obj.y += (obj.y / tileWidth) * this.zoom;
    obj.x += (obj.x / tileWidth) * this.zoom;
  }

  addWall(wall) {
    this.walls.push(wall);
  }

  addItemSlot(slot) {
    this.itemSlots.push(slot);
  }

  setInitialPlayerPosition(obj) {
    this.initialPlayerPosition = {
      x: obj.x + (obj.width / 2),
      y: obj.y + (obj.height / 2)
    };
  }

  placeItems() {
    let itemsToBeCreated = this.minItems - this.items.length;

    if (itemsToBeCreated > 0) {
      let localItems = [...this.items];
      let freeSlots = this.getFreeSlots();
      let itemsLength = Object.keys(localItems).length; 

      while (itemsLength < itemsToBeCreated) {
        let item = this.getRandomItem(freeSlots);
        localItems.push(item);
        itemsLength = Object.keys(localItems).length; 
      }

      this.items = localItems;
    }
  }
 
  getRandomItem(freeSlots) {
    // Getting a random free slot to occupy
    const randomIndex = Math.floor(Math.random() * freeSlots.length);
    const slot = freeSlots[randomIndex];
      
    // Selecting a random item
    let item = this.selector.getItem();

    item.position.x = slot.x;
    item.position.y = slot.y;

    // Remove slot from the free slots array
    freeSlots.splice(randomIndex, 1);

    return item;
  }
  
  /**
   * It filters all the slots that don't share coordinates with an actual
   * item. Getting this way all the free slots.
   * @memberof Map
   */
  getFreeSlots() {
    const slots = this.itemSlots;
    return slots.filter(slot => {
      return this.items.filter(item => {
        return (item.position.x === slot.x &&
                item.position.y === slot.y);
      }).length === 0;
    });
  }

  removeInactiveItems() {
    let inactiveItemIndexes = this.items.reduce((acc, item, index) => {
      if (!item.active) acc.push(index);
      return acc;
    }, []);

    inactiveItemIndexes.forEach(index => {
      this.items.splice(index, 1);
    });
  }

  update(dt, t) {
    // TODO: Spawning time to new item (a little randomly)
    this.removeInactiveItems();
    this.placeItems();
  }
}