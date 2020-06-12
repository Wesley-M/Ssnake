/**
 * Handles the user input (e.g. Attaching actions to be performed after
 *     user events).
 */
export class KeyControls {
  /**
   * Creates an instance of KeyControls.
   * @memberof KeyControls
   */
  constructor() {
    /** @private {!Array<Object>} */
    this.actions = [];

    /** @private {boolean} */
    this.keyDownTriggered = false;
  }

  /**
   * Adds the key event listeners to the document.
   */
  init() {
    /* Get all the registered keydown events. */
    let keyDownActions =
        this.actions.filter(action => action.event == 'keydown');

    /*
      Get all the registered keyup events and filter as well the keydown
      events that want to trigger the action only once while the key is pressed.
      In this case, we create an auxiliar keyup event to give back the ability
      of triggering the action.
    */
    let keyUpActions = this.actions.filter(
        action =>
            (action.event === 'keyup' ||
             (action.event === 'keydown' && action.triggerOnce)));

    this.addKeydownEvents(keyDownActions);
    this.addKeyupEvents(keyUpActions);
  }

  /**
   * Adds an action to a key event. You can specify as well, if you are using a
   * keydown event, whether the action will continue to trigger while the user
   * presses the key only once or not.
   * @param {!Object} action An action description
   * @param {string} action.event keydown or keyup event (e.g. event="keydown")
   * @param {Array<number>} action.keyCodes The key codes
   * @param {function(): undefined} action.run Action to be triggered
   * @param {boolean} action.triggerOnce A flag to specify if the action
   *     will be triggered only once while pressing the key (only apply to
   *     keydown events)
   */
  addKeyAction(action) {
    if (action != null) {
      this.actions.push(action);
    }
  }

  /**
   * Adds the keydown events in the document.
   * @param {Array<{event: string, keyCodes: Array<number>, run: function():
   *     undefined, triggerOnce: boolean}>} keyActions All the key actions
   */
  addKeydownEvents(keyActions) {
    document.addEventListener('keydown', e => {
      const keyCode = e.which;

      const [action] =
          keyActions.filter(keyAction => keyAction.keyCodes.includes(keyCode));

      /*
        If there is an action, then prevent the default key behavior and assert
        whether the action (in keydown event) has already been executed
        checking the keyPressed flag.
      */
      if (action != null) {
        e.preventDefault();
        if (!this.keyDownTriggered) {
          if (action.triggerOnce) this.keyDownTriggered = true;
          action.run();  // Run the action
        }
      }
    }, false);
  }

  /**
   * Adds the keyup events in the document.
   * @param {Array<{event: string, keyCodes: Array<number>, run: function():
   *     undefined, triggerOnce: boolean}>} keyActions All the key actions
   */
  addKeyupEvents(keyActions) {
    document.addEventListener('keyup', e => {
      const keyCode = e.which;

      const [action] =
          keyActions.filter(keyAction => keyAction.keyCodes.includes(keyCode));

      /*
        If there is an action, then prevent the default key behavior and assert
        whether the action (in keydown event) has already been executed
        checking the keyPressed flag. If it's true, then the action is freed to
        execute again.
      */
      if (action != null) {
        e.preventDefault();
        if (action.triggerOnce) {
          this.keyDownTriggered = false;
        } else {
          action.run();
        }
      }
    }, false);
  }
}