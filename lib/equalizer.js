const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the equalizer function.
 *
 *
 * @example
 *  ffmpeg().equalizer()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the equalizer function.
 */
function equalizer(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'equalizer', function() {
    return new EqualizerFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class EqualizerFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    EqualizerFilter.prototype.withFrequency = this.frequency;
    EqualizerFilter.prototype.withWidth_type = this.width_type;
    EqualizerFilter.prototype.withWidth = this.width;
    EqualizerFilter.prototype.withGain = this.gain;
  }

  /**
   * Set the filter’s central frequency in Hz.
   * 
   * 
   * @param val
   */
  frequency(val) {
    this._frequency = val;
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
   * 
   * @param val
   */
  width(val) {
    this._width = val;
    return this;
  }

  /**
   * Set the required gain or attenuation in dB.
   * Beware of clipping when using a positive gain.
   * 
   * @param val
   */
  gain(val) {
    this._gain = val;
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
    if (this._width_type) {
      opt['width_type'] = this._width_type;
    }
    if (this._width) {
      opt['width'] = this._width;
    }
    if (this._gain) {
      opt['gain'] = this._gain;
    }

    addFilter(this.ffmpeg, {
      filter: 'equalizer',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.equalizer = equalizer;
