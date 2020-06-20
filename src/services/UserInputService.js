import { KeyControls } from '../../engine/index.js'

export class UserInputService {
  initSnakeControls(snake) {
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
}