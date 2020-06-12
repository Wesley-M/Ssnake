import { ItemSelector } from './items/selector/ItemSelector.js'

export class Map {
  constructor(w, h) {
    this.items = [];
    this.w = w;
    this.h = h;
    this.minItems = 5;

    this.itemsDim = {w: 24, h: 24};
  }

  placeItems(qty, random = true, coordinates = undefined) {
    if (random) {
      for (let i = 0; i < qty; i++) {
        let randomPosition = {
          x: Math.random() * (this.w - this.itemsDim.w),
          y: Math.random() * (this.h - this.itemsDim.h)
        };

        let item = new ItemSelector().getItem();

        item.position = randomPosition;
        item.texture.img.width = this.itemsDim.w;
        item.texture.img.height = this.itemsDim.h;

        this.items.push(item);
      }
    }
  }

  update() {
    if (this.items.length < this.minItems) {
      this.placeItems(this.minItems - this.items.length);
    }
  }
}
