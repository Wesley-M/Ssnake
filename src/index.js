import SsnakeEngine from "../engine/index.js"

const { CanvasRenderer, Container, Snake, LightSource } = SsnakeEngine;

const STEP = 1 / 60;
const MAX_FRAME = STEP * 5;

const renderer = new CanvasRenderer(640, 480);
document.querySelector("#board").appendChild(renderer.view);

const scene = new Container();
const snake = new Snake();
const light = new LightSource(snake, 20);

scene.add(light);
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