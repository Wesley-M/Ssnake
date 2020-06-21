import {GAME_WIDTH, GAME_HEIGHT, MAX_FRAMES} from './config/settings.js'
import {Map} from './entities/Map.js'
import {Snake} from './entities/Snake.js'
import {UserInputService} from './services/UserInputService.js'
import {ItemsService} from './services/ItemsService.js'
import {CollisionsService} from './services/CollisionsService.js'
import {CanvasRenderer, Container, LightSource, Camera} from '../engine/index.js'

const camera = new Camera(-GAME_WIDTH/2, -GAME_HEIGHT/2);

new Map(GAME_WIDTH, GAME_HEIGHT, "level01", camera).load().then((map) => {

  const userInputService = new UserInputService();
  const itemsService = new ItemsService(map);
  const collisionsService = new CollisionsService(map);
  const renderer = new CanvasRenderer(GAME_WIDTH, GAME_HEIGHT);
  
  const scene = new Container();
  const snake = new Snake(camera, map.initialSnakePosition.x, map.initialSnakePosition.y, map.zoom/3, collisionsService);
  const light = new LightSource(snake, /* ratio= */ 10);
  
  scene.add(map);
  scene.add(snake);
  scene.add(light);

  document.querySelector('#board').appendChild(renderer.view);
  
  userInputService.initSnakeControls(snake);
  
  const run = () => {
    let dt = 0;
    let last = 0;
  
    const loop = ms => {
      let idFrame = requestAnimationFrame(loop);
  
      const t = ms / 1000;
      dt = Math.min(t - last, MAX_FRAMES);
      last = t;
  
      scene.update(dt, t);
      renderer.render(scene);
      itemsService.checkCollisions(/* itemsTarget= */ {light, snake});
    };
  
    requestAnimationFrame(loop);
  }

  run();
});