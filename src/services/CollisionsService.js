import {ShapeCollision} from '../../engine/index.js'

export class CollisionsService {
  constructor(map) {
    this.detecter = new ShapeCollision();
    this.map = map;
  }

  getItemsFromCollision(snake) {
    let snakeCopy = Object.assign({}, snake);

    snakeCopy.width = snakeCopy.segmentRatio;
    snakeCopy.height = snakeCopy.segmentRatio;
    
    return this.detecter.detectCollisions('circle', snakeCopy, this.map.items);
  }

  checkWallCollisions(snake) {
    return this.detecter.detectCollisions('rect', snake, this.map.walls).length > 0;
  }

}