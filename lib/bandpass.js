const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the bandpass function.
 *
 *
 * @example
 *  ffmpeg().bandpass()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the bandpass function.
 */
function bandpass(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'bandpass', function() {
    return new BandpassFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class BandpassFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    BandpassFilter.prototype.withFrequency = this.frequency;
    BandpassFilter.prototype.withCsg = this.csg;
    BandpassFilter.prototype.withWidth_type = this.width_type;
    BandpassFilter.prototype.withWidth = this.width;
  }

  /**
   * Set the filter’s central frequency. Default is 3000.
   * 
   * 
   * @param val
   */
  frequency(val) {
    this._frequency = val;
    return this;
  }

  /**
   * Constant skirt gain if set to 1. Defaults to 0.
   * 
   * 
   * @param val
   */
  csg(val) {
    this._csg = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  width_type(val) {
    this._width_type = val;
    return this;
  }

  /**
   * Specify the band-width of a filter in width_type units.
   * 
   * @param val
   */
  width(val) {
    this._width = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._frequency) {
      opt['frequency'] = this._frequency;
    }
    if (this._csg) {
      opt['csg'] = this._csg;
    }
    if (this._width_type) {
      opt['width_type'] = this._width_type;
    }
    if (this._width) {
      opt['width'] = this._width;
    }

    addFilter(this.ffmpeg, {
      filter: 'bandpass',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.bandpass = bandpass;
