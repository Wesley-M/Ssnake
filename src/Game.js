import {Snake} from './entities/Snake.js'
import {CollisionsService} from './services/CollisionsService.js'
import {ItemsService} from './services/ItemsService.js'
import {UserInputService} from './services/UserInputService.js'
import {Camera, Container, LightSource, Map, PIXIRenderer} from '../engine/index.js'
import {GAME_HEIGHT, GAME_WIDTH, MAX_FRAMES, ALL_ITEMS} from './config/settings.js'

export class Game {
  constructor() {
    this.init();
  }

  init() {
    this.camera = new Camera(0, 0);
    this.level = 'level00';
    this.scene = null;
    this.snake = null;
    this.light = null;
    this.map = null;
    this.enableLight = false;
    this.hasLoaded = false;
    this.renderer = new PIXIRenderer(GAME_WIDTH, GAME_HEIGHT);
    this.load();
  }

  load() {
    this.renderer
        .loader([
            '../res/maps/level00/settings.json',
            '../res/maps/level00/map.json', 
            '../res/maps/level00/sprite_sheet.png',
            '../res/maps/level01/settings.json',
            '../res/maps/level01/map.json', 
            '../res/maps/level01/sprite_sheet.png',
            '../res/maps/level02/settings.json',
            '../res/maps/level02/map.json', 
            '../res/maps/level02/sprite_sheet.png',
            '../res/img/circle.png',
            ''
        ])
        .load(() => {

          this.initMap();
          this.initServices();
          this.initPlayer();
          this.initControls();
          // this.initLight();

          this.populateScene([this.map, this.snake]);
          this.initRenderer();

          this.hasLoaded = true;
        });
  }

  run() {
    let dt = 0;
    let last = 0;

    const loop = ms => {
      let idFrame = requestAnimationFrame(loop);

      const t = ms / 1000;
      dt = Math.min(t - last, MAX_FRAMES);
      last = t;

      if (this.hasLoaded) {
        this.scene.update(dt, t);
        this.renderer.render(this.scene);
        this.itemsService.checkCollisions(/* itemsTarget= */  {snake: this.snake});
      }
    };

    requestAnimationFrame(loop);
  }

  populateScene(objects) {
    this.scene = new Container();
    objects.forEach(obj => {
      if (obj != null) {
        this.scene.add(obj);
      }
    });
  }

  initMap() {
    const resources = PIXI.Loader.shared.resources;

    const itemsDomain = resources[`../res/maps/${this.level}/settings.json`].data.items;

    this.map = new Map(GAME_WIDTH, GAME_HEIGHT, this.camera, this.level, ALL_ITEMS, itemsDomain, 10);
    
    this.map.tilemap = resources[`../res/maps/${this.level}/map.json`].data;
    this.map.tilesheet = resources[`../res/maps/${this.level}/sprite_sheet.png`].texture;
    this.map.hasLightSource = this.map.getTilemapProp('hasLightSource');
    this.map.hasLoaded = true;
    this.map.load();
  }

  initServices() {
    this.userInputService = new UserInputService();
    this.itemsService = new ItemsService(this.map);
    this.collisionsService = new CollisionsService(this.map);
  }

  initControls() {
    this.userInputService.initSnakeControls(this.snake);
  }

  initRenderer() {
    document.querySelector('#board').appendChild(this.renderer.ctx.view);
  }

  initPlayer() {
    this.snake = new Snake(...[
        /* camera= */ this.camera, 
        this.map.initialPlayerPosition.x, 
        this.map.initialPlayerPosition.y, 
        (this.map.zoom / 3) + 3, 
        this.collisionsService
      ]);
  }

  initLight() {
    if (this.enableLight) {
      this.light = new LightSource(this.snake, /* ratio= */ 10);
    }
  }
}