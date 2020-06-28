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
  //  * Loads the tile sprites on screen
  //  */
  // loadMapOnScreen(child, ctx) {
  //   // Getting a map from names to ids
  //   const layerId = {};
  //   child.tilemap.layers.forEach((layer, index) => {
  //     layerId[layer.name] = index;
  //   });

  //   const tileWidth = child.tilemap.tilesets[layerId['background']].tilewidth;

  //   const rowWidthLength = child.tilemap.layers[layerId['background']].width;
  //   const rowHeightLength = child.tilemap.layers[layerId['background']].height;

  //   const tilesheetWidth =
  //       child.tilemap.tilesets[layerId['background']].imagewidth / tileWidth;

  //   this.tilemapContainer = new PIXI.Container();

  //   if (child.tilemap.layers) {
  //     // Iterates over all tile layers
  //     child.tilemap.layers.forEach((layer, layerIndex) => {
  //       if (layer.type === 'tilelayer') {
  //         let layerContainer = new PIXI.ParticleContainer();

  //         // Iterate over all tiles
  //         for (let i = 0; i < rowHeightLength; i++) {
  //           for (let j = 0; j < rowWidthLength; j++) {
  //             let tileID = child.tilemap.layers[layerIndex]
  //                              .data[i * child.tilemap.layers[layerIndex].width + j];

  //             const tileFrameX = (tileID % tilesheetWidth) - 1;
  //             const tileFrameY = (tileID / tilesheetWidth) >> 0;

  //             if (tileFrameX >= 0 && tileFrameY >= 0) {
  //               // Image frame of the tile on the sprite sheet
  //               const rectangle = new PIXI.Rectangle(
  //                   tileWidth * tileFrameX, tileWidth * tileFrameY, tileWidth,
  //                   tileWidth);

  //               // Create a texture based on the sprite image
  //               const texture = new PIXI.Texture(child.tilesheet, rectangle);

  //               // Create the sprite and set its properties
  //               let tile = new PIXI.Sprite(texture);
  //               tile.x = (j * (tileWidth + child.zoom) - child.camera.x) >> 0;
  //               tile.y = (i * (tileWidth + child.zoom) - child.camera.y) >> 0;
  //               tile.width = tileWidth + child.zoom;
  //               tile.height = tileWidth + child.zoom;

  //               // Add sprite to layer
  //               layerContainer.addChild(tile);
  //             }
  //           }

  //           this.tilemapContainer.addChild(layerContainer);
  //         }
  //       }
  //     });

  //     ctx.stage.addChild(this.tilemapContainer);
  //   }

  //   this.lastCamera = Object.assign({}, child.camera);
  // }

  // /**
  //  * Renders the map on the screen
  //  * @param {Object} child The map that will be rendered
  //  * @param {Object} ctx The canvas context
  //  */
  // renderMap(child, ctx) {
  //   if (this.hasLoaded['map'] == null) {
  //     this.loadMapOnScreen(child, ctx);
  //     this.hasLoaded['map'] = true;
  //   }

  //   // Getting a map from names to ids
  //   const layerId = {};
  //   child.tilemap.layers.forEach((layer, index) => {
  //     layerId[layer.name] = index;
  //   });

  //   const canvasWidth = ctx.renderer.view.width;
  //   const canvasHeight = ctx.renderer.view.height;

  //   if (child.tilemap.layers) {
  //     this.tilemapContainer.children.forEach(layer => {
  //       layer.children.forEach(tile => {
  //         if (tile.y >= child.camera.y &&
  //             tile.y < child.camera.y + canvasHeight) {
  //           if (tile.x >= child.camera.x &&
  //               tile.x < child.camera.x + canvasWidth) {
  //             tile.visible = true;
  //           }
  //         }

  //         tile.x -= (child.camera.x - this.lastCamera.x);
  //         tile.y -= (child.camera.y - this.lastCamera.y);
  //       });
  //     });

  //     this.lastCamera = Object.assign({}, child.camera);
  //   }

  //   // child.items.forEach(item => {

  //   //   ctx.drawImage(
  //   //       item.texture.img, item.position.x - child.camera.x,
  //   //       item.position.y - child.camera.y, item.width, item.height);
  //   // });
  // }



  // /**
  //  * Renders a snake on the screen
  //  * @param {Object} child The snake that will be rendered
  //  * @param {Object} ctx The canvas context
  //  */
  // renderSnake(child, ctx) {
  //   this.graphics.clear();

  //   // Draws an segment of the snake.
  //   const drawSegment =
  //       (x, y, ratio) => {
  //         this.graphics.beginFill(0x44FFFF);
  //         this.graphics.drawCircle(x, y, ratio);
  //         this.graphics.endFill();
  //         ctx.stage.addChild(this.graphics);
  //       }

  //   // Check if the segment index is included in the snake body
  //   function inBody(index, tailSegments) {
  //     return (index < child.body.length - tailSegments);
  //   }

  //   function
  //   updateCameraPosition() {
  //     const cameraTargetX = child.position.x - ctx.renderer.view.width / 2;
  //     child.camera.x += ((cameraTargetX - child.camera.x) / 10 >> 0);

  //     const cameraTargetY = child.position.y - ctx.renderer.view.height / 2;
  //     child.camera.y += ((cameraTargetY - child.camera.y) / 10 >> 0);
  //   }

  //   // Updating the camera position before drawing
  //   updateCameraPosition();

  //   // Drawing the snake head
  //   drawSegment(
  //       child.head.x - child.camera.x - child.segmentRatio / 2,
  //       child.head.y - child.camera.y - child.segmentRatio / 2,
  //       child.segmentRatio);

  //   // Tail params
  //   let tailRatio = 9 / 10;
  //   const tailSegments = Math.round(child.body.length * tailRatio);
  //   const decreaseProportion = (1 / tailSegments);

  //   // Segment proportion
  //   let segProportion = 1;

  //   // Draw body
  //   child.body.forEach((segment, index) => {
  //     drawSegment(
  //         segment.x - child.camera.x - child.segmentRatio / 2,
  //         segment.y - child.camera.y - child.segmentRatio / 2,
  //         child.segmentRatio * segProportion);
  //     if (!inBody(index, tailSegments)) segProportion -= decreaseProportion;
  //   });
  // }

  // /**
  //  * Renders the map on the screen
  //  * @param {Object} child The map that will be rendered
  //  * @param {Object} ctx The canvas context
  //  */
  // renderMap(child, ctx) {
  //   if (this.hasLoaded['map'] == null) {
  //     this.loadMapOnScreen(child, ctx);
  //     this.hasLoaded['map'] = true;
  //   }

  //   // Getting a map from names to ids
  //   const layerId = {};
  //   child.tilemap.layers.forEach((layer, index) => {
  //     layerId[layer.name] = index;
  //   });

  //   const canvasWidth = ctx.renderer.view.width;
  //   const canvasHeight = ctx.renderer.view.height;

  //   if (child.tilemap.layers) {
  //     this.tilemapContainer.children.forEach(layer => {
  //       layer.children.forEach(tile => {
  //         if (tile.y >= child.camera.y &&
  //             tile.y < child.camera.y + canvasHeight) {
  //           if (tile.x >= child.camera.x &&
  //               tile.x < child.camera.x + canvasWidth) {
  //             tile.visible = true;
  //           }
  //         }

  //         tile.x -= (child.camera.x - this.lastCamera.x);
  //         tile.y -= (child.camera.y - this.lastCamera.y);
  //       });
  //     });

  //     this.lastCamera = Object.assign({}, child.camera);
  //   }

  //   // child.items.forEach(item => {

  //   //   ctx.drawImage(
  //   //       item.texture.img, item.position.x - child.camera.x,
  //   //       item.position.y - child.camera.y, item.width, item.height);
  //   // });
  // }

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