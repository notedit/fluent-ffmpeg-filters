const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the boxblur function.
 *
 *
 * @example
 *  ffmpeg().boxblur()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the boxblur function.
 */
function boxblur(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'boxblur', function() {
    return new BoxblurFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class BoxblurFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    BoxblurFilter.prototype.withLuma_radius = this.luma_radius;
    BoxblurFilter.prototype.withLuma_power = this.luma_power;
    BoxblurFilter.prototype.withChroma_radius = this.chroma_radius;
    BoxblurFilter.prototype.withChroma_power = this.chroma_power;
    BoxblurFilter.prototype.withAlpha_radius = this.alpha_radius;
  }

  /**
   * 
   * @param val
   */
  luma_radius(val) {
    this._luma_radius = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  luma_power(val) {
    this._luma_power = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  chroma_radius(val) {
    this._chroma_radius = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  chroma_power(val) {
    this._chroma_power = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  alpha_radius(val) {
    this._alpha_radius = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._luma_radius) {
      opt['luma_radius'] = this._luma_radius;
    }
    if (this._luma_power) {
      opt['luma_power'] = this._luma_power;
    }
    if (this._chroma_radius) {
      opt['chroma_radius'] = this._chroma_radius;
    }
    if (this._chroma_power) {
      opt['chroma_power'] = this._chroma_power;
    }
    if (this._alpha_radius) {
      opt['alpha_radius'] = this._alpha_radius;
    }

    addFilter(this.ffmpeg, {
      filter: 'boxblur',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.boxblur = boxblur;
