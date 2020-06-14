export class Snake {
  constructor(x = 10, y = 10) {
    this.head = {x, y};
    this.body = [];
    this.position = this.head;
    this.speed = 3;
    this.velocity = {x: 0, y: 0};
    this.segmentRatio = 8;
    this.minLength = 40;
    this.minSpeed = 1;
    this.currentDirection;
    this.distanceBetweenSegments = 2;
    this.turning = false;
    this.turningIterations = 15;
    this.decreaseSpeedOnTurningBy = 0.4;
    this.keys = 0;
    this.dead = false;

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
        this.velocity.y = -speed;
        break;
      case 'down':
        this.velocity.y = speed;
        break;
      case 'left':
        this.velocity.x = -speed;
        break;
      case 'right':
        this.velocity.x = speed;
        break;
    }
  }

  desaccelerate() {
    this.velocity = {x: 0, y: 0};
  }

  moveSegments() {
    const FIRST_SEGMENT = 0;

    //  Move the head of the snake
    this.head.x += this.velocity.x;
    this.head.y += this.velocity.y;

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
    this.speed = Math.max(snake.minSpeed, snake.speed - value);
  }

  increaseSpeed(value) {
    this.speed += value;
  }

  update() {
    this.move(this.currentDirection);
  }
}