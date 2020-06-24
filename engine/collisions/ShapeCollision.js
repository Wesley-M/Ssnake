/**
 * Detect simple shape collisions
 */
export class ShapeCollision {
  
  /**
   * Detects collisions between player and objects. A rectangle with width and
   * height must be passed, but other circumscript shapes can be detected.
   * 
   * @param {string} [type='circle'] It can also assume 'rect' or 'circle'.
   * @param {!Object} player
   * @param {!Array<Object>} objects
   * @returns An array with all the objects in which the player collided.
   * @memberof ShapeCollision
   */
  detectCollisions(type = 'circle', player, objects) {
    let detectedCollisions = [];

    let detected = false;

    objects.forEach(obj => {
      switch (type) {
        case 'circle':
          detected = this.circleCollision(player, obj);
          break;
        case 'rect':
          detected = this.rectCollision(player, obj);
          break;
        default:
      }

      if (detected) detectedCollisions.push(obj);
    });

    return detectedCollisions;
  }

  /**
   * Detects a collision between a player and a circular object. The two
   * need to be specified as squares that has the width property.
   *
   * @param {!Object} player
   * @param {!Object} obj
   * @returns A boolean that is true if the player has collided with the object 
   *     and false otherwise.
   * @memberof ShapeCollision
   */
  circleCollision(player, obj) {
    // Calculates the center point of a rectangle
    const calcCenterPoint =
        (target) => {
          return {
            x: target.position.x + Math.round(target.width / 2),
            y: target.position.y + Math.round(target.width / 2)
          };
        }

    const playerCenterPoint = calcCenterPoint(player);
    const objCenterPoint = calcCenterPoint(obj);
    
    // Calculate the distance between the center points
    let distanceBetween = Math.sqrt(
        Math.pow(playerCenterPoint.x - objCenterPoint.x, 2) +
        Math.pow(playerCenterPoint.y - objCenterPoint.y, 2));
    
    // If the distance between the points is bigger than the sum of their 
    // ratios
    return (distanceBetween < ((player.width / 2) + (obj.width / 2)));
  }

  /**
   * Detects a collision between a player and a rectangular object. The two
   * need to be specified as squares that has the width and height properties.
   *
   * @param {!Object} player
   * @param {!Object} obj
   * @returns A boolean that is true if the player has collided with the object 
   *     and false otherwise.
   * @memberof ShapeCollision
   */
  rectCollision(player, obj) {
    // Checks whether a x is in between two numbers
    const between = (x, start, end) => (x >= start && x <= end);

    return (
        between(player.position.x, obj.x, obj.x + obj.width) &&
        between(player.position.y, obj.y, obj.y + obj.height));
  }
}