export class MapRenderer {
  constructor() {
    this.lastCamera = null;
    this.hasLoaded = false;
  }

  load(map, canvas) {
    this.tilemapContainer = new PIXI.Container();

    if (map.tilemap.layers) {
      map.tilemap.layers.forEach((layer, layerIndex) => {
        if (layer.type === 'tilelayer') {
          let layerContainer = this.getLayerContainer(map, layerIndex);
          this.tilemapContainer.addChild(layerContainer);
        }
      });

      canvas.stage.addChild(this.tilemapContainer);
    }

    this.lastCamera = Object.assign({}, map.camera);
  }

  /**
   * Renders the map on the screen
   */
  render(map, canvas) {
    this.checkMapLoad(map, canvas);

    const canvasWidth = canvas.renderer.view.width;
    const canvasHeight = canvas.renderer.view.height;

    // Checks whether a x is in between two numbers
    const between = (x, start, end) => (x >= start && x <= end);

    if (map.tilemap.layers) {
      this.tilemapContainer.children.forEach(layer => {
        layer.children.forEach(tile => {
          if (between(tile.y, map.camera.y, map.camera.y + canvasHeight)) {
            if (between(tile.x, map.camera.x, map.camera.x + canvasWidth)) {
              tile.visible = true;
            }
          }
          tile.x -= (map.camera.x - this.lastCamera.x);
          tile.y -= (map.camera.y - this.lastCamera.y);
        });
      });

      this.lastCamera = Object.assign({}, map.camera);
    }
  }

  checkMapLoad(map, canvas) {
    if (this.hasLoaded === false) {
      this.load(map, canvas);
      this.hasLoaded = true;
    }
  }

  getLayerContainer(map, layerIndex) {
    let layerContainer = new PIXI.ParticleContainer();

    // Gets a layer map from name to id
    const layerId = this.getLayersMap(map);

    const tileset = map.tilemap.tilesets[layerId['background']];
    const tileWidth = tileset.tilewidth;
    const canvasTileWidth = map.tilemap.width;
    const canvasTileHeight = map.tilemap.height;
    const tilesheetWidth = tileset.imagewidth / tileWidth;

    for (let i = 0; i < canvasTileHeight; i++) {
      for (let j = 0; j < canvasTileWidth; j++) {
        let tileIndex = this.getTileIndex(map, layerIndex, j, i);

        const tileFrameX = (tileIndex % tilesheetWidth) - 1;
        const tileFrameY = Math.floor(tileIndex / tilesheetWidth);

        if (tileFrameX < 0 || tileFrameY < 0) continue;

        const txt = this.createTileTexture(map.tilesheet, tileWidth, tileFrameX, tileFrameY);
        const tile = this.createTile(map, txt, j, i, tileWidth);

        layerContainer.addChild(tile);
      }
    }

    return layerContainer;
  }

  getLayersMap(map) {
    const layerId = {};
    map.tilemap.layers.forEach((layer, index) => {
      layerId[layer.name] = index;
    });
    return layerId;
  }

  getTileIndex(map, layerIndex, x, y) {
    return map.tilemap.layers[layerIndex]
        .data[y * map.tilemap.layers[layerIndex].width + x];
  }

  createTileTexture(tilesheet, tileWidth, tileFrameX, tileFrameY) {
    // Image frame of the tile on the sprite sheet
    const frame = new PIXI.Rectangle(
        tileWidth * tileFrameX, tileWidth * tileFrameY, tileWidth, tileWidth);

    return new PIXI.Texture(tilesheet, frame);
  }

  createTile(map, texture, x, y, tileWidth) {
    let tile = new PIXI.Sprite(texture);

    tile.x = (x * (tileWidth + map.zoom) - map.camera.x);
    tile.y = (y * (tileWidth + map.zoom) - map.camera.y);
    tile.width = tileWidth + map.zoom;
    tile.height = tileWidth + map.zoom;

    return tile;
  }
}