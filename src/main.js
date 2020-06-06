import SsnakeEngine from "../engine/index.js"
import Map from "./entities/Map.js"
import Snake from "./entities/Snake.js"

const { CanvasRenderer, Container, LightSource } = SsnakeEngine;

const CLIENT_WIDTH = window.innerWidth || 
                     document.documentElement.clientWidth || 
                     document.body.clientWidth;

const CLIENT_HEIGHT = window.innerHeight || 
                      document.documentElement.clientHeight || 
                      document.body.clientHeight;

const STEP = 1 / 60;
const MAX_FRAME = STEP * 5;

const GAME_WIDTH = CLIENT_WIDTH * 0.7;
const GAME_HEIGHT = CLIENT_HEIGHT * 0.8;

const renderer = new CanvasRenderer(GAME_WIDTH, GAME_HEIGHT);
document.querySelector("#board").appendChild(renderer.view);

const scene = new Container();

const map = new Map(GAME_WIDTH, GAME_HEIGHT);
const snake = new Snake();
const light = new LightSource(snake);

scene.add(light);
scene.add(map);
scene.add(snake);

function run() {
    let dt = 0;
    let last = 0;

    const loop = ms => {
        let idFrame = requestAnimationFrame(loop);

        const t = ms / 1000;
        dt = Math.min(t - last, MAX_FRAME);
        last = t;

        scene.update(dt, t);
        renderer.render(scene);
    };

    requestAnimationFrame(loop);
}

run();