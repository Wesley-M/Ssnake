export default class Sound {
  constructor(filename, volume, loop = false) {
    this._audioElement = document.createElement('audio');
    this._configAudioElement(filename, volume, loop);
    this.running = false;
  }

  _configAudioElement(filename, volume, loop) {
    this._audioElement.src = filename;
    this._audioElement.volume = volume;
    this._audioElement.setAttribute('preload', 'auto');
    this._audioElement.setAttribute('controls', 'none');
    this._audioElement.style.display = 'none';
    this._audioElement.loop = loop;
    document.body.appendChild(this._audioElement);
  }

  play() {
    this._audioElement.play();
    this.running = true;
  }

  stop() {
    this._audioElement.pause();
    this.running = false;
  }

  resetTime() {
    this._audioElement.currentTime = 0;
  }

  loop(type) {
    this._audioElement.loop = type;
  }

  toggle() {
    if (this.running)
      this.stop();
    else
      this.play();
  }
}