import {KeyControls, CanvasRenderer, Container, LightSource} from '../engine/index.js'
import {Map} from './entities/Map.js'
import {Snake} from './entities/Snake.js'

const CLIENT_WIDTH = window.innerWidth ||
                     document.documentElement.clientWidth || 
                     document.body.clientWidth;

const CLIENT_HEIGHT = window.innerHeight ||
                      document.documentElement.clientHeight || 
                      document.body.clientHeight;

const GAME_WIDTH = CLIENT_WIDTH * 0.7;
const GAME_HEIGHT = CLIENT_HEIGHT * 0.8;
const FRAME_STEP = 1 / 60;
const MAX_FRAMES = FRAME_STEP * 5;

function initUserInput(snake) {
  const controls = new KeyControls();

  controls.addKeyAction({
    event: 'keydown',
    keyCodes: [37, 65],  // ArrowLeft | a
    run: () => snake.move('left'),
    triggerOnce: false
  });

  controls.addKeyAction({
    event: 'keydown',
    keyCodes: [39, 68],  // ArrowRight | d
    run: () => snake.move('right'),
    triggerOnce: false
  });

  controls.addKeyAction({
    event: 'keydown',
    keyCodes: [40, 83],  // ArrowDown | s
    run: () => snake.move('down'),
    triggerOnce: false
  });

  controls.addKeyAction({
    event: 'keydown',
    keyCodes: [38, 87],  // ArrowUp | w
    run: () => snake.move('up'),
    triggerOnce: false
  });

  controls.addKeyAction({
    event: 'keyup',
    keyCodes: [
      37, 65, 39, 68, 38, 87, 40, 83
    ],  // (ArrowLeft | a | ArrowRight | d | ArrowDown | s | ArrowUp | w)
    run: () => snake.desaccelerate(),
    triggerOnce: false
  });

  controls.init();
}

function initMainLoop(scene, renderer) {
  let dt = 0;
  let last = 0;

  const loop = ms => {
    let idFrame = requestAnimationFrame(loop);

    const t = ms / 1000;
    dt = Math.min(t - last, MAX_FRAMES);
    last = t;

    scene.update(dt, t);
    renderer.render(scene);
  };

  requestAnimationFrame(loop);
}

const renderer = new CanvasRenderer(GAME_WIDTH, GAME_HEIGHT);

const scene = new Container();
const map = new Map(GAME_WIDTH, GAME_HEIGHT);
const snake = new Snake();
const light = new LightSource(snake, /* ratio= */ 10);

scene.add(light);
scene.add(map);
scene.add(snake);

document.querySelector('#board').appendChild(renderer.view);

initUserInput(snake);
initMainLoop(scene, renderer);