export const NORMAL_PROB = 0.8;
export const RARE_PROB = (1 - NORMAL_PROB);
export const RARE_PROB_LEVEL_1 = 0.8 * RARE_PROB;
export const RARE_PROB_LEVEL_2 = 0.2 * RARE_PROB;

export const POSSIBLE_PROBS = [
  NORMAL_PROB,
  RARE_PROB_LEVEL_1,    
  RARE_PROB_LEVEL_2,   
];

const CLIENT_WIDTH = window.innerWidth ||
                     document.documentElement.clientWidth || 
                     document.body.clientWidth;

const CLIENT_HEIGHT = window.innerHeight ||
                      document.documentElement.clientHeight || 
                      document.body.clientHeight;

export const GAME_WIDTH = CLIENT_WIDTH * 0.7;
export const GAME_HEIGHT = CLIENT_HEIGHT * 0.8;

const FRAME_STEP = 1 / 60;
export const MAX_FRAMES = FRAME_STEP * 5;