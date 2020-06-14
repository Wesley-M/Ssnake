import {GAME_WIDTH, GAME_HEIGHT, MAX_FRAMES} from './config/settings.js'
import {Map} from './entities/Map.js'
import {Snake} from './entities/Snake.js'
import {UserInputService} from './services/UserInputService.js'
import {ItemsService} from './services/ItemsService.js'
import {CanvasRenderer, Container, LightSource} from '../engine/index.js'

function run() {
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

const scene = new Container();
const map = new Map(GAME_WIDTH, GAME_HEIGHT);
const snake = new Snake();
const light = new LightSource(snake, /* ratio= */ 5);

scene.add(light);
scene.add(map);
scene.add(snake);

const userInputService = new UserInputService();
const itemsService = new ItemsService(map);
const renderer = new CanvasRenderer(GAME_WIDTH, GAME_HEIGHT);

document.querySelector('#board').appendChild(renderer.view);

userInputService.initSnakeMoves(snake);

run();