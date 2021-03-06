const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the framerate function.
 *
 *
 * @example
 *  ffmpeg().framerate()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the framerate function.
 */
function framerate(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'framerate', function() {
    return new FramerateFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class FramerateFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    FramerateFilter.prototype.withFps = this.fps;
    FramerateFilter.prototype.withInterp_start = this.interp_start;
    FramerateFilter.prototype.withInterp_end = this.interp_end;
    FramerateFilter.prototype.withScene = this.scene;
    FramerateFilter.prototype.withFlags = this.flags;
  }

  /**
   * Specify the output frames per second. This option can also be specified
   * as a value alone. The default is 50.
   * 
   * 
   * @param val
   */
  fps(val) {
    this._fps = val;
    return this;
  }

  /**
   * Specify the start of a range where the output frame will be created as a
   * linear interpolation of two frames. The range is [0-255],
   * the default is 15.
   * 
   * 
   * @param val
   */
  interp_start(val) {
    this._interp_start = val;
    return this;
  }

  /**
   * Specify the end of a range where the output frame will be created as a
   * linear interpolation of two frames. The range is [0-255],
   * the default is 240.
   * 
   * 
   * @param val
   */
  interp_end(val) {
    this._interp_end = val;
    return this;
  }

  /**
   * Specify the level at which a scene change is detected as a value between
   * 0 and 100 to indicate a new scene; a low value reflects a low
   * probability for the current frame to introduce a new scene, while a higher
   * value means the current frame is more likely to be one.
   * The default is 7.
   * 
   * 
   * @param val
   */
  scene(val) {
    this._scene = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  flags(val) {
    this._flags = val;
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
    if (this._interp_start) {
      opt['interp_start'] = this._interp_start;
    }
    if (this._interp_end) {
      opt['interp_end'] = this._interp_end;
    }
    if (this._scene) {
      opt['scene'] = this._scene;
    }
    if (this._flags) {
      opt['flags'] = this._flags;
    }

    addFilter(this.ffmpeg, {
      filter: 'framerate',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.framerate = framerate;
