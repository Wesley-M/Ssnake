export default class KeyControls {
    constructor () {
        this.actions = [];
        this.keyPressed = false;
    }

    addKeyAction(event, keyCode, action, triggerOnceInPressedKey) {
        this.actions.push({keyCode: keyCode, run: action, event: event, triggerOnce: triggerOnceInPressedKey});
    }

    init() {
        let keyDownActions = this.actions.filter(action => action.event == "keydown");
        let keyUpActions = this.actions.filter(action => (action.event == "keyup" || action.triggerOnce));

        this.__addKeydownEvents(keyDownActions);
        this.__addKeyupEvents(keyUpActions);
    }

    __addKeydownEvents(keyActions) {
        document.addEventListener("keydown", e => {
            const keyCode = e.which;

            let action = keyActions.filter(keyAction => keyAction.keyCode == keyCode);

            if (action.length != 0) {
                e.preventDefault();
                
                if (!this.keyPressed) {
                    if (action[0].triggerOnce) this.keyPressed = true;
        
                    // Run action
                    action[0].run();
                }
            }

        }, false);
    }

    __addKeyupEvents(keyActions) {
        document.addEventListener("keyup", e => {
            const keyCode = e.which;

            let action = keyActions.filter(keyAction => keyAction.keyCode == keyCode);

            if (action.length != 0) {

                e.preventDefault();
                if (action[0].triggerOnce) this.keyPressed = false;
                else action[0].run();
            }
        }, false);
    }
}