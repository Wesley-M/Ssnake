import {CollisionDetecter} from '../../engine/index.js'

export class CollisionsService {
  constructor(map) {
    this.collisionDetecter = new CollisionDetecter();
    this.map = map;
  }

  getItemsFromCollision() {
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

  checkWallCollisions(targetPosition) {
    const between = (x, start, end) => (x >= start && x <= end);
    for (let wall of this.map.walls) {
      if (between(targetPosition.x, wall.x, wall.x + wall.width) &&
          between(targetPosition.y, wall.y, wall.y + wall.height)) {
        return true; 
      }
    }
    return false;
  }

}