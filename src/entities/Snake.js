export class Snake {
  constructor(camera, x = 10, y = 10, collisionsService) {
    this.head = {x, y};
    this.body = [];
    this.position = this.head;
    this.speed = 1;
    this.velocity = {dx: 0, dy: 0};
    this.segmentRatio = 4;
    this.minLength = 20;
    this.minSpeed = 1;
    this.currentDirection;
    this.distanceBetweenSegments = 2;
    this.turning = false;
    this.turningIterations = 20;
    this.decreaseSpeedOnTurningBy = 0.3;
    this.keys = 0;
    this.dead = false;
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
    return this.collisionsService.checkWallCollisions(
        {x: this.position.x, y: this.position.y});
  }

  move(direction) {
    const oppositeDirections =
        {'up': 'down', 'left': 'right', 'right': 'left', 'down': 'up'};

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
    this.speed = Math.max(snake.minSpeed, this.speed - value);
  }

  increaseSpeed(value) {
    this.speed += value;
  }

  update() {
    this.move(this.currentDirection);
  }
}