const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the fps function.
 *
 *
 * @example
 *  ffmpeg().fps()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the fps function.
 */
function fps(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'fps', function() {
    return new FpsFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class FpsFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    FpsFilter.prototype.withFps = this.fps;
    FpsFilter.prototype.withRound = this.round;
    FpsFilter.prototype.withStart_time = this.start_time;
  }

  /**
   * The desired output frame rate. The default is 25.
   * 
   * 
   * @param val
   */
  fps(val) {
    this._fps = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  round(val) {
    this._round = val;
    return this;
  }

  /**
   * Assume the first PTS should be the given value, in seconds. This allows for
   * padding/trimming at the start of stream. By default, no assumption is made
   * about the first frame’s expected PTS, so no padding or trimming is done.
   * For example, this could be set to 0 to pad the beginning with duplicates of
   * the first frame if a video stream starts after the audio stream or to trim any
   * frames with a negative PTS.
   * 
   * 
   * @param val
   */
  start_time(val) {
    this._start_time = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._fps) {
      opt['fps'] = this._fps;
    }
    if (this._round) {
      opt['round'] = this._round;
    }
    if (this._start_time) {
      opt['start_time'] = this._start_time;
    }

    addFilter(this.ffmpeg, {
      filter: 'fps',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.fps = fps;
