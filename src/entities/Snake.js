export class Snake {
  constructor(camera, x = 10, y = 10, segmentRatio, collisionsService) {
    this.head = {x, y};
    this.body = [];
    this.minLength = 30;
    this.distanceBetweenSegments = 1;

    this.segmentRatio = segmentRatio;
    this.tailPortion = (9 / 10);

    this.position = this.head;
    this.speed = 2;
    this.velocity = {dx: 0, dy: 0};
    this.minSpeed = 1;
    this.decreaseSpeedOnTurningBy = 0.4;
    
    this.currentDirection = null;
    this.turning = false;
    this.turningIterations = 20;
    
    this.keys = 0;
    this.dead = false;
    
    this.slitherLastUpdate = 0;
    this.slitherCounter = 0;
    this.slitherAmplitude = 3;
    this.slitherLastVariation = null;
    
    this.collisionsService = collisionsService;
    this.camera = camera;

    this.initBody();
  }

  initBody() {
    let segment = 1;
    for (let i = 0; i < this.minLength; i++) {
      this.body.push({
        x: this.head.x,
        y: this.head.y + segment * this.distanceBetweenSegments
      });
      segment += 1;
    }
  }

  hasWallCollisions() {
    return this.collisionsService.checkWallCollisions(this);
  }

  move(direction) {
    const oldDirection = this.currentDirection;
    this.currentDirection = direction;

    const newSpeed = this.getNewSpeed(oldDirection);
    this.changeVelocity(direction, newSpeed);

    this.moveSegments();
  }

  getNewSpeed(oldDirection) {
    const changedDirection = this.currentDirection != null &&
        (oldDirection != this.currentDirection);

    let newSpeed = 0;

    // When the direction changes, then for a number of iterations the
    // speed will decrease.
    if (changedDirection) {
      this.turning = true;
      newSpeed = this.speed * (1 - this.decreaseSpeedOnTurningBy);
    } else {
      if (this.turningIterations > 0 && this.turning) {
        this.turningIterations -= 1;
        newSpeed = this.speed * (1 - this.decreaseSpeedOnTurningBy);
      } else if (this.turningIterations <= 0) {
        this.turning = false;
        this.turningIterations = 15;
        newSpeed = this.speed;
      } else {
        newSpeed = this.speed;
      }
    }

    return newSpeed;
  }

  changeVelocity(direction, speed = this.speed) {
    switch (direction) {
      case 'up':
        this.velocity.dy = -speed;
        break;
      case 'down':
        this.velocity.dy = speed;
        break;
      case 'left':
        this.velocity.dx = -speed;
        break;
      case 'right':
        this.velocity.dx = speed;
        break;
    }
  }

  desaccelerate() {
    this.velocity = {dx: 0, dy: 0};
  }

  moveSegments() {
    const FIRST_SEGMENT = 0;

    this.head.x += this.velocity.dx;
    if (this.hasWallCollisions()) {
      this.head.x -= this.velocity.dx;
    }

    this.head.y += this.velocity.dy;
    if (this.hasWallCollisions()) {
      this.head.y -= this.velocity.dy;
    }

    // Move the first body segment
    this.moveSegmentTowards(this.body[FIRST_SEGMENT], this.head);

    // Move the rest of the body
    this.body.forEach((segment, index) => {
      if (index != FIRST_SEGMENT) {
        const LAST_SEGMENT = index - 1;
        this.moveSegmentTowards(segment, this.body[LAST_SEGMENT]);
      }
    });
  }

  moveSegmentTowards(seg1, seg2) {
    const currentDistanceBetweenSegs =
        this.getDistanceBetweenSegments(seg1, seg2);
    if (currentDistanceBetweenSegs > this.distanceBetweenSegments) {
      const angle = Math.atan2(seg2.y - seg1.y, seg2.x - seg1.x);
      const relativeSpeed =
          Math.abs(currentDistanceBetweenSegs - this.distanceBetweenSegments);
      seg1.x += Math.cos(angle) * relativeSpeed;
      seg1.y += Math.sin(angle) * relativeSpeed;
    }
  }

  getDistanceBetweenSegments(seg1, seg2) {
    return Math.sqrt(
        Math.pow((seg1.x - seg2.x), 2) + Math.pow((seg1.y - seg2.y), 2));
  }

  takeKey() {
    this.keys += 1;
  }

  eat(value) {
    const tail = {...this.body[this.body.length - 1]};
    for (let i = 0; i < value; i++) {
      const newSegment = {
        x: tail.x,
        y: tail.y + i * this.distanceBetweenSegments
      };
      this.body.push(newSegment);
    }
  }

  starve(value) {
    for (let i = 0; i < value; i++) {
      this.body.pop();
    }
  }

  die() {
    this.dead = true;
  }

  decreaseSpeed(value) {
    this.speed = Math.max(this.minSpeed, this.speed - value);
  }

  increaseSpeed(value) {
    this.speed += value;
  }

  updateCamera(canvasWidth, canvasHeight) {
    const cameraTargetX = this.head.x - canvasWidth / 2;
    this.camera.x += ((cameraTargetX - this.camera.x) / 10 >> 0);
    const cameraTargetY = this.head.y - canvasHeight / 2;
    this.camera.y += ((cameraTargetY - this.camera.y) / 10 >> 0);
  }

  update(dt, t) {
    if (t - this.slitherLastUpdate > 0.02) {
      this.slitherVariation =
          this.slitherAmplitude * Math.sin((10 / 4) * this.slitherCounter);

      if (this.slitherLastVariation === null) {
        this.slitherLastVariation = this.slitherVariation;
      }

      if (['up', 'down'].includes(this.currentDirection)) {
        this.position.x =
            this.position.x - this.slitherLastVariation + this.slitherVariation;
        if (this.hasWallCollisions()) {
          this.position.x = this.position.x + this.slitherLastVariation -
              this.slitherVariation;
        }
      } else {
        this.position.y =
            this.position.y - this.slitherLastVariation + this.slitherVariation;
        if (this.hasWallCollisions()) {
          this.position.y = this.position.y + this.slitherLastVariation -
              this.slitherVariation;
        }
      }

      if (this.slitherLastVariation != this.slitherVariation) {
        this.slitherLastVariation = this.slitherVariation;
      }

      this.slitherCounter = (this.slitherCounter + 0.1) % 100;
      this.slitherLastUpdate = t;
    }

    this.move(this.currentDirection);
  }
}