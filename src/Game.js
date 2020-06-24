import {Camera, CanvasRenderer, Container, LightSource} from '../engine/index.js'

import {GAME_HEIGHT, GAME_WIDTH, MAX_FRAMES} from './config/settings.js'
import {Map} from './entities/Map.js'
import {Snake} from './entities/Snake.js'
import {CollisionsService} from './services/CollisionsService.js'
import {ItemsService} from './services/ItemsService.js'
import {UserInputService} from './services/UserInputService.js'

export class Game {
  constructor() {
    this.init();
  }

  init() {
    this.camera = new Camera(-GAME_WIDTH / 2, -GAME_HEIGHT / 2);
    this.level = 'level00';
    this.scene = null;
    this.snake = null;
    this.light = null;
    this.enableLight = false;
    this.hasLoaded = false;
    this.load();
  }

  load() {
    new Map(GAME_WIDTH, GAME_HEIGHT, this.level, this.camera)
        .load()
        .then((map) => {
          this.map = map;
          this.enableLight = map.hasLightSource;
          
          this.initServices();
          this.initPlayer();
          this.initControls();
          this.initLight();

          this.populateScene([this.map, this.snake, this.light]);
          this.initRenderer();

          this.hasLoaded = true;
        })
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
        this.itemsService.checkCollisions(
            /* itemsTarget= */ {light: this.light, snake: this.snake});
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

  initServices() {
    this.userInputService = new UserInputService();
    this.itemsService = new ItemsService(this.map);
    this.collisionsService = new CollisionsService(this.map);
  }

  initControls() {
    this.userInputService.initSnakeControls(this.snake);
  }

  initRenderer() {
    this.renderer = new CanvasRenderer(GAME_WIDTH, GAME_HEIGHT);
    document.querySelector('#board').appendChild(this.renderer.view);
  }

  initPlayer() {
    this.snake = new Snake(...[
        /* camera= */ this.camera,
        /* x= */ this.map.initialSnakePosition.x,
        /* y= */ this.map.initialSnakePosition.y,
        /* segmentRatio= */ this.map.zoom / 3,
        /* collisionsService= */ this.collisionsService]);
  }

  initLight() {
    if (this.enableLight) {
      this.light = new LightSource(this.snake, /* ratio= */ 10);
    }
  }
}