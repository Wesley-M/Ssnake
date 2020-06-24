/**
 * Represents a audio element
 * @export
 * @class Sound
 */
export class Sound {
  /**
   * Creates an instance of Sound.
   * @param {string} filename The filename of the sound
   * @param {number} volume The volume of the sound
   * @param {boolean} [loop=false] Flag to specify if the audio is in loop
   * @memberof Sound
   */
  constructor(filename, volume, loop = false) {
    this.audioElement = document.createElement('audio');
    this.init(filename, volume, loop);
    this.running = false;
  }

  /**
   * The init function from the constructor
   * @param {string} filename The filename of the sound
   * @param {number} volume The volume of the sound
   * @param {boolean} [loop=false] Flag to specify if the audio is in loop
   * @memberof Sound
   */
  init(filename, volume, loop) {
    this.audioElement.src = filename;
    this.audioElement.volume = volume;
    this.audioElement.setAttribute('preload', 'auto');
    this.audioElement.setAttribute('controls', 'none');
    this.audioElement.style.display = 'none';
    this.audioElement.loop = loop;
    document.body.appendChild(this.audioElement);
  }

  /**
   * Start the audio, preempting an old execution if needed.
   * @memberof Sound
   */
  play() {
    this.running = true;
    this.stop();
    this.resetTime();
    this.audioElement.play();
  }

  /**
   * Stop the audio
   * @memberof Sound
   */
  stop() {
    this.running = false;
    this.audioElement.pause();
  }

  /**
   * Reset the audio time
  */
  resetTime() {
    this.audioElement.currentTime = 0;
  }
  
  /**
   * Toggle audio state. If the audio is playing, then it stops. If it's not,
   * then it starts.
  */
  toggle() {
    if (this.running) {
      this.stop();
    } else {
      this.play();
    }
  }
}