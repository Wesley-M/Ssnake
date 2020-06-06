export default class LightSource {
    constructor(obj, ratio) {
        this.obj = obj;
        this.position = {x: this.obj.position.x, y: this.obj.position.y};
        this.ratio = ratio;
    }

    update() {
        this.position = {x: this.obj.position.x, y: this.obj.position.y};
    }
}