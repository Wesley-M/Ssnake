export class SnakeRenderer {
  constructor() {
    this.hasLoaded = false;
    this.segmentsContainer = new PIXI.ParticleContainer();
  }

  load(snake, canvas) {
    const canvasWidth = canvas.renderer.view.width;
    const canvasHeight = canvas.renderer.view.height;

    snake.updateCamera(canvasWidth, canvasHeight);

    this.createHead(snake, canvas);
    this.createBody(snake, canvas);

    canvas.stage.addChild(this.segmentsContainer);
  }

  render(snake, canvas) {
    this.checkSnakeLoad(snake, canvas);
    this.checkSnakeUpdate(snake, canvas);

    const canvasWidth = canvas.renderer.view.width;
    const canvasHeight = canvas.renderer.view.height;

    snake.updateCamera(canvasWidth, canvasHeight);
    
    const camera = snake.camera;
    const segRatio = snake.segmentRatio;

    this.segmentsContainer.children.forEach((segmentSprite, index) => {
      if (index == 0) {
        segmentSprite.x = snake.head.x - camera.x - (segRatio / 2);
        segmentSprite.y = snake.head.y - camera.y - (segRatio / 2);
      } else {
        segmentSprite.x = snake.body[index - 1].x - camera.x - (segRatio / 2);
        segmentSprite.y = snake.body[index - 1].y - camera.y - (segRatio / 2);
      }
    });
  }

  update(snake, canvas, snakeLength, segmentsLength) {
    for (let i = 0; i < (snakeLength - segmentsLength); i++) {
      let newSegment = this.createSegment(10, 10, 10);
      this.segmentsContainer.addChild(newSegment);
    }
    this.updateSegmentsRatio(snake, canvas);
  }

  updateSegmentsRatio(snake, canvas) {
    const snakeLength = snake.body.length + 1;
    const tailLength = Math.round(snakeLength * snake.tailPortion);
    const decreaseProportion = (1 / tailLength);
    let segProportion = 1;

    let segments = this.segmentsContainer.children;

    segments.forEach((segment, index) => {
      const segmentRatio = snake.segmentRatio * segProportion;
      segment.width = 2 * segmentRatio;
      segment.height = 2 * segmentRatio;

      // const newSegment = this.createSegment(segment.x, segment.y, segmentRatio);
      
      // this.segmentsContainer.removeChildAt(index);
      // this.segmentsContainer.addChildAt(newSegment, index);
      
      if (!this.inBody(snake, index, tailLength)) segProportion -= decreaseProportion;
    });
  }

  inBody(snake, index, tailSegments) {
    return (index < snake.body.length - tailSegments);
  }

  checkSnakeLoad(snake, canvas) {
    if (this.hasLoaded === false) {
      this.load(snake, canvas);
      this.hasLoaded = true;
    }
  }

  checkSnakeUpdate(snake, canvas) {
    const segmentsLength = this.segmentsContainer.children.length;
    const snakeLength = snake.body.length + 1;
    if (segmentsLength < snakeLength) {
      this.update(snake, canvas, snakeLength, segmentsLength);
    }
  }

  createSegment(canvas, x, y, ratio) {
    const resources = PIXI.Loader.shared.resources;
    const segTexture = resources[`../res/img/circle.png`].texture;
    let segSprite = new PIXI.Sprite(segTexture);
    segSprite.x = x;
    segSprite.y = y;
    segSprite.width = 2 * ratio;
    segSprite.height = 2 * ratio;
    return segSprite;
  }

  createHead(snake, canvas) {
    const camera = snake.camera;
    const segRatio = snake.segmentRatio;

    const headX = snake.head.x - camera.x - (segRatio / 2);
    const headY = snake.head.y - camera.x - (segRatio / 2);
    const headRatio = snake.segmentRatio;
    
    const headSprite = this.createSegment(headX, headY, headRatio);

    this.segmentsContainer.addChild(headSprite);
  }

  createBody(snake, canvas) {
    snake.body.forEach(segment => {
      const camera = snake.camera;
      const segRatio = snake.segmentRatio;

      const segmentX = segment.x - camera.x - (segRatio / 2);
      const segmentY = segment.y - camera.y - (segRatio / 2);
      
      const segSprite = this.createSegment(segmentX, segmentY, 10);

      this.segmentsContainer.addChild(segSprite);
    });

    this.updateSegmentsRatio(snake, canvas);
  }
}