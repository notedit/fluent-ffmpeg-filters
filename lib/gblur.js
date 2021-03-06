const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the gblur function.
 *
 *
 * @example
 *  ffmpeg().gblur()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the gblur function.
 */
function gblur(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'gblur', function() {
    return new GblurFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class GblurFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    GblurFilter.prototype.withSigma = this.sigma;
    GblurFilter.prototype.withSteps = this.steps;
    GblurFilter.prototype.withPlanes = this.planes;
    GblurFilter.prototype.withSigmaV = this.sigmaV;
  }

  /**
   * Set horizontal sigma, standard deviation of Gaussian blur. Default is 0.5.
   * 
   * 
   * @param val
   */
  sigma(val) {
    this._sigma = val;
    return this;
  }

  /**
   * Set number of steps for Gaussian approximation. Defauls is 1.
   * 
   * 
   * @param val
   */
  steps(val) {
    this._steps = val;
    return this;
  }

  /**
   * Set which planes to filter. By default all planes are filtered.
   * 
   * 
   * @param val
   */
  planes(val) {
    this._planes = val;
    return this;
  }

  /**
   * Set vertical sigma, if negative it will be same as sigma.
   * Default is -1.
   * 
   * @param val
   */
  sigmaV(val) {
    this._sigmaV = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._sigma) {
      opt['sigma'] = this._sigma;
    }
    if (this._steps) {
      opt['steps'] = this._steps;
    }
    if (this._planes) {
      opt['planes'] = this._planes;
    }
    if (this._sigmaV) {
      opt['sigmaV'] = this._sigmaV;
    }

    addFilter(this.ffmpeg, {
      filter: 'gblur',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.gblur = gblur;
