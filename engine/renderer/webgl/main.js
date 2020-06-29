import {MapRenderer} from './modules/MapRenderer.js'
import {SnakeRenderer} from './modules/SnakeRenderer.js'

/**
 * Render all the elements from the game
 */
export class PIXIRenderer {
  /**
   * Create a PIXI renderer.
   * @param {number} w Canvas width
   * @param {number} h Canvas height
   */
  constructor(w, h) {
    this.ctx = this.initApplication(w, h);
    this.snakeRenderer = new SnakeRenderer();
    this.mapRenderer = new MapRenderer();
  }

  initApplication(w, h) {
    return new PIXI.Application({
      width: w,
      height: h,
      antialias: true,
      transparent: false,
      resolution: 1
    });
  }

  loader(resources) {
    return PIXI.Loader.shared.add(resources);
  }

  /**
   * Used to render a container object and it's children recursively.
   * @param {!Container} container A container that represents a collection of
   *     objects.
   */
  render(container) {
    const renderRec =
        (container) => {
          container.children.forEach((child) => {
            if (child.visible == false) return;  // Check visibility

            this.renderLeaf(child, this.ctx);

            // Handle the children nodes
            if (child.children) this.renderRec(this.ctx, child);
          });
        }

    renderRec(container);  // Recursion call
  }

  /**
   * Renders a specific object
   * @param {Object} child A object that will be rendered
   * @param {Object} ctx The canvas context
   */
  renderLeaf(child, ctx) {
    switch (child.constructor.name) {
      case 'Snake':
        this.snakeRenderer.render(child, ctx);
        break;
      case 'Map':
        this.mapRenderer.render(child, ctx);
        break;
      // case 'LightSource':
      //   this.renderLight(child, ctx);
      //   break;
      default:
    }
  }


  // /**
  //  * Renders the light source on the screen
  //  * @param {Object} child The light source that will be rendered
  //  * @param {Object} ctx The canvas context
  //  */
  // renderLight(child, ctx) {
  //   // ctx.save();  // Saving the context

  //   // // Where both shapes overlap the color is determined by adding color
  //   // values ctx.globalCompositeOperation = 'source-over';

  //   // // The vision field ratio is equal to the canvas diagonal
  //   // const visionFieldRatio =
  //   //     Math.sqrt(Math.pow(this.w, 2) + Math.pow(this.h, 2));

  //   // // The light source ratio is expressed by a fraction of the
  //   // visionFieldRatio const lightRatio = child.ratio / 100;

  //   // // Variation in light source ratio
  //   // const variation = Math.abs(0.015 * Math.sin(Date.now() / 1000));

  //   // // Light source position
  //   // const x = child.position.x;
  //   // const y = child.position.y;

  //   // // Creating radial gradient
  //   // let radialGradient =
  //   //     ctx.createRadialGradient(x, y, 0, x, y, visionFieldRatio);

  //   // // Adding the color stops to the gradient
  //   // radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  //   // radialGradient.addColorStop(lightRatio / 10, `rgba(255, 255, 255,
  //   // 0.09)`); radialGradient.addColorStop(
  //   //     (lightRatio / 2) + variation, `rgba(0, 0, 0, 0.7)`);
  //   // radialGradient.addColorStop(
  //   //     Math.min(lightRatio + variation, 1), `rgba(0, 0, 0, 1)`);
  //   // radialGradient.addColorStop(1, `rgba(0, 0, 0, 1)`);

  //   // // Drawing the circle of light
  //   // ctx.fillStyle = radialGradient;
  //   // ctx.beginPath();
  //   // ctx.arc(x, y, visionFieldRatio, 0, 2 * Math.PI);
  //   // ctx.fill();

  //   // ctx.restore();  // Restoring the context
  // }

  // /**
  //  * Renders the text on the screen
  //  * @param {Object} child The text that will be rendered
  //  * @param {Object} ctx The canvas context
  //  */
  // renderText(child, ctx) {
  //   const {font, fill, align} = child.style;
  //   if (font) ctx.font = font;
  //   if (fill) ctx.fillStyle = fill;
  //   if (align) ctx.textAlign = align;
  //   ctx.fillText(child.text, 0, 0);
  // }

  // /**
  //  * Renders the texture on the screen
  //  * @param {Object} child The texture that will be rendered
  //  * @param {Object} ctx The canvas context
  //  */
  // renderTexture(child, ctx) {
  //   ctx.drawImage(child.texture.img, child.position.x, child.position.y);
  // }
}