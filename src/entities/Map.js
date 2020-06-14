import {ItemSelector} from './items/selector/ItemSelector.js'

export class Map {
  constructor(w, h) {
    this.items = [];
    this.w = w;
    this.h = h;
    this.minItems = 5;
    this.itemsDistanceRatio = 50;
    this.margin = 40;

    this.placeItems(this.minItems);
  }

  placeItems(qty, random = true, coordinates = undefined) {
    if (random) {
      for (let i = 0; i < qty; i++) {
        let gotCoordinate = false;
        let randomCoordinate = null;

        while (!gotCoordinate) {
          randomCoordinate = {
            x: this.margin +
                Math.random() * (this.w - this.margin),
            y: this.margin +
                Math.random() * (this.h - this.margin)
          };

          gotCoordinate =
              !this.targetInsideItemsRatio(randomCoordinate, this.items);
        }

        let item = new ItemSelector().getItem();

        item.position = randomCoordinate;

        this.items.push(item);
      }
    }
  }

  targetInsideItemsRatio(target, items) {
    let filteredItems =
        items.filter(item => item.x !== target.x || item.y !== target.y);

    for (let item of filteredItems) {
      let distance = Math.sqrt(
          Math.pow(target.x - item.x, 2) + Math.pow(target.y - item.y, 2));
      if (distance < this.itemsDistanceRatio) {
        return true;
      }
    }

    return false;
  }

  update() {
    // TODO: Spawning time to new item (a little random)
    let inactiveItemIndexes = this.items.reduce((acc, item, index) => {
      if (!item.active) acc.push(index);
      return acc;
    }, []);

    inactiveItemIndexes.forEach(index => {
      this.items.splice(index, 1);
    });

    if (this.items.length < this.minItems) {
      this.placeItems(this.minItems - this.items.length);
    }
  }
}
