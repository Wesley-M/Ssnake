import {CollisionsService} from '../services/CollisionsService.js'

export class ItemsService {
  constructor(map) {
    this.items = map.items;
  }

  checkCollisions(itemTargets) {
    const collisionsService = new CollisionsService();
    const collisionItems =
        collisionsService.getItemsFromCollision(itemTargets.snake, this.items);

    collisionItems.forEach((item) => {
      switch(item.props.target) {
        case 'snake':
          item.props.applyEffect(itemTargets.snake);
          break;
        case 'light':
          item.props.applyEffect(itemTargets.light);
          break;
        default:
      }

      item.props.active = false;
    });
  }
}