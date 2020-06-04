import { POSSIBLE_PROBS, FXS_MAP } from '../config/settings.js'

export default class EffectSelector {

    constructor() {
        super();
    }

    /**
     * This function returns a new effect object based on the name passed, if no name is passed
     * a effect will be choosed randomly.
     * @param  {String} effectName The name of the effect.
     * @return {String} A new effect object.
     */
    getEffect(effectName) {
        if (FXS_MAP[effectName] != undefined) {
            let effectProb = FXS_MAP[effectName].prob;
            return new FXS_MAP[effectName].class_constructor(effectProb);
        } else {
            let effectName = this.chooseRandomEffectName();
            let effectProb = FXS_MAP[effectName].prob;
            return new FXS_MAP[effectName].class_constructor(effectProb);
        }
    }

    /**
     * This function returns one of the effect names.
     * @return {String} An effect name.
     */
    chooseRandomEffectName() {
        const randomProbFromEvent = this.getProbFromRandomEvent();
        let effectsToChooseFrom = this.getPossibleEffects(randomProbFromEvent);

        // Here we select one of the effects that share the same probability 
        let randomIndex = Math.ceil(effectsToChoosefrom.length * Math.random());

        return effectsToChooseFrom[randomIndex];
    }

    /**
     * We have different probabilities to select different effects, because of this
     * some effects will appear more often than others. With that said, this function 
     * objective is to create artificial events with different probabilities and use 
     * a pseudo-random function to select an event.  
     * @return {Number} The probability from the event selected.
     */
    getProbFromRandomEvent() {
        // pseudo-random number between 0 (inclusive) and 1 (exclusive) 
        let randomNumber = Math.random();

        let intervalStart = 0;
        let intervalEnd = 0;

        // The artificial events are represented by sub-intervals from [0,1), 
        // each interval has a ((intervalEnd - intervalStart) * 100)% chance
        // of containing the random number. When one of the sub-intervals is
        // selected we return the probability of this happening (that matches
        // one of the possible probabilities of spawning a type of goal).
        POSSIBLE_PROBS.forEach(prob => {
            intervalEnd = (startInterval + prob);
            if (randomNumber >= intervalStart && randomNumber < intervalEnd) {
                return prob;
            }
            startInterval += prob;
        });
    }

    /**
     * This function get all effects that happen with the probabity passed as argument.
     * @param  {Number} prob One of the possible probabities for the goals to happen.
     * @return {Array}       Array of effects that share this probabity.
     */
    getPossibleEffects(prob) {
        let effectsToChooseFrom = [];
        // Get all the effects that happen with this probability
        Object.keys(FXS_MAP).forEach(name => {
            if (FXS_MAP[name].prob == prob) {
                effectsToChooseFrom.push(name);
            }
        });
        return effectsToChooseFrom;
    }
}