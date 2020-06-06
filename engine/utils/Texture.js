export default class Texture {
    constructor (url, w, h) {
        this.img = new Image();
        this.img.src = url;
    }
}