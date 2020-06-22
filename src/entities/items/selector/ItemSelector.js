import { POSSIBLE_PROBS } from '../../../config/settings.js'
import { ITEMS_MAP } from '../config/settings.js'

export class ItemSelector {
  /**
   * This function returns a new item based on the name passed, if the name
   * is not found to be a valid item name, then the item will be choosed
   * randomly.
   * @param  {String} itemName The name of the item.
   * @return {String} A new item.
   */
  getItem(itemName) {
    if (ITEMS_MAP[itemName] != undefined) {
      return new ITEMS_MAP[itemName]();
    } else {
      let itemName = this.chooseRandomItemName();
      return new ITEMS_MAP[itemName]();
    }
  }

  /**
   * This function returns one of the item names.
   * @return {String} An item name.
   */
  chooseRandomItemName() {
    const randomProbFromEvent = this.getProbFromRandomEvent();
    let itemsToChooseFrom = this.getPossibleItems(randomProbFromEvent);

    // Here we select one of the items that share the same rarity class
    let randomIndex = Math.floor(itemsToChooseFrom.length * Math.random());

    return itemsToChooseFrom[randomIndex];
  }

  /**
   * We have different probabilities to select different items, because of this
   * some items will appear more often than others. With that said, this
   * function objective is to create artificial events with different
   * probabilities and use a pseudo-random function to select an event.
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
    // one rarity class).
    for (const prob of POSSIBLE_PROBS) {
      intervalEnd = (intervalStart + prob);
      if (randomNumber >= intervalStart && randomNumber < intervalEnd) {
        return prob;
      }
      intervalStart += prob;
    }
  }

  /**
   * This function get all items that happen to share the same rarity class.
   * @param  {Number} prob One of the possible rarity classes for the items.
   * @return {Array}       Array of items that share this class.
   */
  getPossibleItems(prob) {
    let itemsToChooseFrom = [];
    // Get all the items that happen with this probability
    Object.keys(ITEMS_MAP).forEach(name => {
      if (new ITEMS_MAP[name]().rarityClass.toFixed(3) == prob.toFixed(3)) {
        itemsToChooseFrom.push(name);
      }
    });
    return itemsToChooseFrom;
  }
}