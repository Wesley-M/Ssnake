import {CollisionsService} from '../services/CollisionsService.js'

export class ItemsService {
  constructor(map) {
    this.map = map;
    this.items = map.items;
  }

  checkCollisions(itemTargets) {
    const collisionsService = new CollisionsService(this.map);
    const collisionItems =
        collisionsService.getItemsFromCollision(itemTargets.snake);

    collisionItems.forEach((item) => {
      switch(item.target) {
        case 'snake':
          item.applyEffect(itemTargets.snake);
          break;
        case 'light':
          item.applyEffect(itemTargets.light);
          break;
        default:
      }

      item.active = false;
    });
  }
}