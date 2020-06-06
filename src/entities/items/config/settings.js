import Mushroom from "../Mushroom.js";
import Poison from "../Poison.js";
import Food from "../Food.js";
import DarkRing from "../DarkRing.js";
import LightRing from "../LightRing.js";
import DeathItem from "../DeathItem.js";
import SpeedFlower from "../SpeedFlower.js";
import Key from "../Key.js";

const ITEMS_MAP = {
    mushroom: Mushroom,
    poison: Poison,
    food: Food,
    dark_ring: DarkRing,
    light_ring: LightRing,
    death_item: DeathItem,
    speed_flower: SpeedFlower
}

export {
    ITEMS_MAP
};