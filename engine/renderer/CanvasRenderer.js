/**
 * Render all the elements from the game
 */
export class CanvasRenderer {
  /**
   * Create a canvas renderer.
   * @param {number} w Canvas width
   * @param {number} h Canvas height
   */
  constructor(w, h) {
    const canvas = document.createElement('canvas');
    this.w = canvas.width = w;
    this.h = canvas.height = h;
    this.view = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.textBaseline = 'top';
  }

  /**
   * Used to render a container object and it's children recursively.
   * @param {!Container} container A container that represents a collection of
   *     objects.
   */
  render(container) {
    const {ctx} = this;

    const renderRec =
        (ctx, container) => {
          container.children.forEach((child) => {
            if (child.visible == false) return;  // Check visibility

            ctx.save();  // Saving the context

            this.renderLeaf(child, ctx);

            // Handle the children nodes
            if (child.children) this.renderRec(ctx, child);

            ctx.restore();  // Restoring the context
          });
        }

    ctx.clearRect(0, 0, this.w, this.h); // Cleaning the canvas
    renderRec(ctx, container); // Recursion call
  }

  /**
   * Renders a specific object
   * @param {Object} child A object that will be rendered
   * @param {Object} ctx The canvas context
   */
  renderLeaf(child, ctx) {
    switch (child.constructor.name) {
      case 'Snake':
        this.renderSnake(child, ctx);
        break;
      case 'Map':
        this.renderMap(child, ctx);
        break;
      case 'LightSource':
        this.renderLight(child, ctx);
        break;
      default:
    }
  }

  /**
   * Renders a snake on the screen
   * @param {Object} child The snake that will be rendered
   * @param {Object} ctx The canvas context
   */
  renderSnake(child, ctx) {
    // Draws an segment of the snake.
    function drawSegment(x, y, ratio) {
      ctx.beginPath();
      ctx.arc(x, y, ratio, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Check if the segment index is included in the snake body
    function inBody(index, tailSegments) {
      return (index < child.body.length - tailSegments);
    }

    // Defining the snake color.
    const SNAKE_COLOR = '#114411';

    // Render the snake below the light source.
    ctx.globalCompositeOperation = 'destination-over';

    // Using the snake color
    ctx.fillStyle = SNAKE_COLOR;

    // Drawing the snake head
    drawSegment(child.head.x, child.head.y, child.segmentRatio);

    // Tail params
    let tailRatio = 9 / 10;
    const tailSegments = Math.round(child.body.length * tailRatio);
    const decreaseProportion = (1 / tailSegments);

    // Segment proportion
    let segProportion = 1;

    // Draw body
    child.body.forEach((segment, index) => {
      drawSegment(segment.x, segment.y, child.segmentRatio * segProportion);
      if (!inBody(index, tailSegments)) segProportion -= decreaseProportion;
    });
  }

  /**
   * Renders the map on the screen
   * @param {Object} child The map that will be rendered
   * @param {Object} ctx The canvas context
   */
  renderMap(child, ctx) {
    // The map is drawn behind the light source.
    ctx.globalCompositeOperation = 'destination-over';

    // Render the items on the screen
    child.items.forEach(item => {
      ctx.drawImage(
          item.texture.img, item.position.x, item.position.y,
          item.texture.img.width, item.texture.img.height);
    });
  }

  /**
   * Renders the light source on the screen
   * @param {Object} child The light source that will be rendered
   * @param {Object} ctx The canvas context
   */
  renderLight(child, ctx) {
    ctx.save();  // Saving the context

    // Where both shapes overlap the color is determined by adding color values
    ctx.globalCompositeOperation = 'lighter';

    // The vision field ratio is equal to the canvas diagonal
    const visionFieldRatio =
        Math.sqrt(Math.pow(this.w, 2) + Math.pow(this.h, 2));

    // The light source ratio is expressed by a fraction of the visionFieldRatio
    const lightRatio = child.ratio / 100;

    // Variation in light source ratio
    const variation = Math.abs(0.05 * Math.sin(Date.now() / 1000));

    // Light source position
    const x = child.position.x;
    const y = child.position.y;

    // Creating radial gradient
    let radialGradient =
        ctx.createRadialGradient(x, y, 0, x, y, visionFieldRatio);

    // Adding the color stops to the gradient
    radialGradient.addColorStop(0, 'rgba(255, 183, 0, 0.09)');
    radialGradient.addColorStop(lightRatio / 10, `rgba(255, 183, 0, 0.1)`);
    radialGradient.addColorStop(
        (lightRatio / 2) + variation, `rgba(40, 40, 40, 0.7)`);
    radialGradient.addColorStop(
        Math.min(lightRatio + variation, 1), `rgba(40, 40, 40, 1)`);
    radialGradient.addColorStop(1, `rgba(40, 40, 40, 1)`);

    // Drawing the circle of light
    ctx.fillStyle = radialGradient;
    ctx.beginPath();
    ctx.arc(x, y, visionFieldRatio, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();  // Restoring the context
  }

  /**
   * Renders the text on the screen
   * @param {Object} child The text that will be rendered
   * @param {Object} ctx The canvas context
   */
  renderText(child, ctx) {
    const {font, fill, align} = child.style;
    if (font) ctx.font = font;
    if (fill) ctx.fillStyle = fill;
    if (align) ctx.textAlign = align;
    ctx.fillText(child.text, 0, 0);
  }

  /**
   * Renders the texture on the screen
   * @param {Object} child The texture that will be rendered
   * @param {Object} ctx The canvas context
   */
  renderTexture(child, ctx) {
    ctx.drawImage(child.texture.img, child.position.x, child.position.y);
  }
}