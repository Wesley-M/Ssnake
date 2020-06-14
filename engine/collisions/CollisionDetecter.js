export class CollisionDetecter {
  detect(player, objects) {
    let detectedCollisions = [];
    objects.forEach(object => {
      let distance = Math.sqrt(
          Math.pow(player.centerPoint.x - object.centerPoint.x, 2) +
          Math.pow(player.centerPoint.y - object.centerPoint.y, 2));

      if (distance < (player.ratio + object.ratio)) {
        detectedCollisions.push(object);
      }
    });

    return detectedCollisions;
  }
}