/**
 * A container that represents a collection of objects that have children
 */
export class Container {
  /**
   * Creates an instance of Container.
   * @memberof Container
   */
  constructor() {
    this.position = {x: 0, y: 0};
    this.children = [];
  }

  /**
   * Add a child to the container
   * @param {!Object} child The object that will be added
   * @return {Object} The object that has been added
   */
  add(child) {
    this.children.push(child);
    return child;
  }

  /**
   * Remove a child from the container
   * @param {!Object} child The object that will be removed
   * @return {Object} The object that has been removed
   */
  remove(child) {
    this.children = this.children.filter(c => c !== child);
    return child;
  }

  /**
   * Updates all the children recursively
   * @param {number} dt The time between frames
   * @param {number} t The current timestamp
   */
  update(dt, t) {
    this.children.forEach(child => {
      if (child.update) {
        child.update(dt, t);
      }
    });
  }
}