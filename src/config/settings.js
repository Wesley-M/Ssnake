export const NORMAL_PROB = 0.8;
export const RARE_PROB = (1 - NORMAL_PROB);
export const RARE_PROB_LEVEL_1 = 0.8 * RARE_PROB;
export const RARE_PROB_LEVEL_2 = 0.2 * RARE_PROB;

export const POSSIBLE_PROBS = [
  NORMAL_PROB,
  RARE_PROB_LEVEL_1,    
  RARE_PROB_LEVEL_2,   
];
