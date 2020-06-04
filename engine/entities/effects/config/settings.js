import DecreaseSpeed from "../DecreaseSpeed";
import RemoveSegments from "../RemoveSegments";
import AddSegments from "../AddSegments";
import DecreaseVisibleRatio from "../DecreaseVisibleRatio";
import IncreaseVisibleRatio from "../IncreaseVisibleRatio";
import Death from "../Death";
import IncreaseSpeed from "../IncreaseSpeed";
import GetKey from "../GetKey";

const NORMAL_FX_PROB = 0.7;
const RARE_FX_PROB = (1 - NORMAL_FX_PROB);
const RARE_PROB_LEVEL_1 = 0.7 * RARE_FX_PROB;
const RARE_PROB_LEVEL_2 = 0.2 * RARE_FX_PROB;
const RARE_PROB_LEVEL_3 = 0.1 * RARE_FX_PROB;

const POSSIBLE_PROBS = [
    NORMAL_FX_PROB,
    RARE_PROB_LEVEL_1,    
    RARE_PROB_LEVEL_2,   
    RARE_PROB_LEVEL_3    
];

const FXS_MAP = {
    normal_point: {
        prob: NORMAL_FX_PROB,
        class_constructor: AddSegments
    }, 
    decrease_speed: { 
        prob: RARE_PROB_LEVEL_1,
        class_constructor: DecreaseSpeed
    },
    remove_segments: { 
        prob: RARE_PROB_LEVEL_1,
        class_constructor: RemoveSegments
    },
    decrease_visible_ratio: {
        prob: RARE_PROB_LEVEL_1,
        class_constructor: DecreaseVisibleRatio
    },
    increase_visible_ratio: {
        prob: RARE_PROB_LEVEL_1,
        class_constructor: IncreaseVisibleRatio
    },
    death: {
        prob: RARE_PROB_LEVEL_2,
        class_constructor: Death 
    },
    increase_speed: {
        prob: RARE_PROB_LEVEL_2,
        class_constructor: IncreaseSpeed 
    },
    add_segments: {
        prob: RARE_PROB_LEVEL_2,
        class_constructor: AddSegments 
    },
    key: {
        prob: RARE_PROB_LEVEL_3,
        class_constructor: GetKey
    }
}

export {
    POSSIBLE_PROBS,
    FXS_MAP
};