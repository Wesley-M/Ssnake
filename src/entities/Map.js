import { ItemSelector } from './items/selector/ItemSelector.js'

export class Map {
  constructor(w, h) {
    this.items = [];
    this.w = w;
    this.h = h;
    this.min_items = 5;

    this.items_dim = {w: 24, h: 24};
  }

  placeItems(qty, random = true, coordinates = undefined) {
    if (random) {
      for (let i = 0; i < qty; i++) {
        let randomPosition = {
          x: Math.random() * (this.w - this.items_dim.w),
          y: Math.random() * (this.h - this.items_dim.h)
        };

        let item = new ItemSelector().getItem();

        item.position = randomPosition;
        item.texture.img.width = this.items_dim.w;
        item.texture.img.height = this.items_dim.h;

        this.items.push(item);
      }
    }
  }

  update() {
    if (this.items.length < this.min_items) {
      this.placeItems(this.min_items - this.items.length);
    }
  }
}
