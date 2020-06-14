import {CollisionDetecter} from '../../engine/index.js'

export class CollisionsService {
  constructor() {
    this.collisionDetecter = new CollisionDetecter();
  }

  getItemsFromCollision(snake, items) {
    const circleCollisionItems = items.map((item) => {
      return {
        centerPoint: {
          x: item.position.x + Math.round(item.width / 2),
          y: item.position.y + Math.round(item.height / 2)
        },
        ratio: Math.round(item.width / 2),
        props: item
      };
    });

    const circleCollisionSnake = {
      centerPoint: snake.head,
      ratio: snake.segmentRatio
    };

    return this.collisionDetecter.detect(
        circleCollisionSnake, circleCollisionItems);
  }
}