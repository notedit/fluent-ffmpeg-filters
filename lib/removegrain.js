const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the removegrain function.
 *
 *
 * @example
 *  ffmpeg().removegrain()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the removegrain function.
 */
function removegrain(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'removegrain', function() {
    return new RemovegrainFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class RemovegrainFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    RemovegrainFilter.prototype.withM0 = this.m0;
    RemovegrainFilter.prototype.withM1 = this.m1;
    RemovegrainFilter.prototype.withM2 = this.m2;
    RemovegrainFilter.prototype.withM3 = this.m3;
  }

  /**
   * Set mode for the first plane.
   * 
   * 
   * @param val
   */
  m0(val) {
    this._m0 = val;
    return this;
  }

  /**
   * Set mode for the second plane.
   * 
   * 
   * @param val
   */
  m1(val) {
    this._m1 = val;
    return this;
  }

  /**
   * Set mode for the third plane.
   * 
   * 
   * @param val
   */
  m2(val) {
    this._m2 = val;
    return this;
  }

  /**
   * Set mode for the fourth plane.
   * 
   * @param val
   */
  m3(val) {
    this._m3 = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._m0) {
      opt['m0'] = this._m0;
    }
    if (this._m1) {
      opt['m1'] = this._m1;
    }
    if (this._m2) {
      opt['m2'] = this._m2;
    }
    if (this._m3) {
      opt['m3'] = this._m3;
    }

    addFilter(this.ffmpeg, {
      filter: 'removegrain',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.removegrain = removegrain;
