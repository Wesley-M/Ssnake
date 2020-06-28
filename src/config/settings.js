import { Mushroom } from '../entities/items/Mushroom.js';
import { DarkRing } from '../entities/items/DarkRing.js';
import { LightRing } from '../entities/items/LightRing.js';
import { Poison } from '../entities/items/Poison.js';
import { SpeedFlower } from '../entities/items/SpeedFlower.js';
import { DeathItem } from '../entities/items/DeathItem.js';
import { Food } from '../entities/items/Food.js';

const CLIENT_WIDTH = window.innerWidth ||
    document.documentElement.clientWidth || document.body.clientWidth;

const CLIENT_HEIGHT = window.innerHeight ||
    document.documentElement.clientHeight || document.body.clientHeight;

const GAME_WIDTH = CLIENT_WIDTH * 0.7;
const GAME_HEIGHT = CLIENT_HEIGHT * 0.8;

const FRAME_STEP = 1 / 60;
const MAX_FRAMES = FRAME_STEP * 5;

const ALL_ITEMS = {
  mushroom: Mushroom,
  poison: Poison,
  food: Food,
  dark_ring: DarkRing,
  light_ring: LightRing,
  death_item: DeathItem,
  speed_flower: SpeedFlower
}

export {
    GAME_WIDTH,
    GAME_HEIGHT,
    MAX_FRAMES,
    ALL_ITEMS
};