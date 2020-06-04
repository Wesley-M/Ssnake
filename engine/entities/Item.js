import EffectSelector from './effects/selector/EffectSelector.js'

export default class Item {
    constructor(x, y, hasEffect, effect) {
        this.coordinate = {x, y};
        this.hasEffect = hasEffect;
        this.effect = effect;
    }

    applyEffect(object, effect_value) {
        if (typeof this.effect.apply === "function") {
            this.effect.apply(object, effect_value);
        }
    }

    get effect(){
        return this.effect;
    }

    set effect(newEffect) {
        if (this.hasEffect === true) {
            this.effect = new EffectSelector().getEffect(newEffect);
        }
    }
}
