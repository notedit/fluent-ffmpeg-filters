const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the decimate function.
 *
 *
 * @example
 *  ffmpeg().decimate()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the decimate function.
 */
function decimate(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'decimate', function() {
    return new DecimateFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class DecimateFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    DecimateFilter.prototype.withCycle = this.cycle;
    DecimateFilter.prototype.withDupthresh = this.dupthresh;
    DecimateFilter.prototype.withScthresh = this.scthresh;
    DecimateFilter.prototype.withBlockx = this.blockx;
    DecimateFilter.prototype.withBlocky = this.blocky;
    DecimateFilter.prototype.withPpsrc = this.ppsrc;
    DecimateFilter.prototype.withChroma = this.chroma;
  }

  /**
   * Set the number of frames from which one will be dropped. Setting this to
   * N means one frame in every batch of N frames will be dropped.
   * Default is 5.
   * 
   * 
   * @param val
   */
  cycle(val) {
    this._cycle = val;
    return this;
  }

  /**
   * Set the threshold for duplicate detection. If the difference metric for a frame
   * is less than or equal to this value, then it is declared as duplicate. Default
   * is 1.1
   * 
   * 
   * @param val
   */
  dupthresh(val) {
    this._dupthresh = val;
    return this;
  }

  /**
   * Set scene change threshold. Default is 15.
   * 
   * 
   * @param val
   */
  scthresh(val) {
    this._scthresh = val;
    return this;
  }

  /**
   * Set the size of the x and y-axis blocks used during metric calculations.
   * Larger blocks give better noise suppression, but also give worse detection of
   * small movements. Must be a power of two. Default is 32.
   * 
   * 
   * @param val
   */
  blockx(val) {
    this._blockx = val;
    return this;
  }

  /**
   * Set the size of the x and y-axis blocks used during metric calculations.
   * Larger blocks give better noise suppression, but also give worse detection of
   * small movements. Must be a power of two. Default is 32.
   * 
   * 
   * @param val
   */
  blocky(val) {
    this._blocky = val;
    return this;
  }

  /**
   * Mark main input as a pre-processed input and activate clean source input
   * stream. This allows the input to be pre-processed with various filters to help
   * the metrics calculation while keeping the frame selection lossless. When set to
   * 1, the first stream is for the pre-processed input, and the second
   * stream is the clean source from where the kept frames are chosen. Default is
   * 0.
   * 
   * 
   * @param val
   */
  ppsrc(val) {
    this._ppsrc = val;
    return this;
  }

  /**
   * Set whether or not chroma is considered in the metric calculations. Default is
   * 1.
   * 
   * @param val
   */
  chroma(val) {
    this._chroma = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._cycle) {
      opt['cycle'] = this._cycle;
    }
    if (this._dupthresh) {
      opt['dupthresh'] = this._dupthresh;
    }
    if (this._scthresh) {
      opt['scthresh'] = this._scthresh;
    }
    if (this._blockx) {
      opt['blockx'] = this._blockx;
    }
    if (this._blocky) {
      opt['blocky'] = this._blocky;
    }
    if (this._ppsrc) {
      opt['ppsrc'] = this._ppsrc;
    }
    if (this._chroma) {
      opt['chroma'] = this._chroma;
    }

    addFilter(this.ffmpeg, {
      filter: 'decimate',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.decimate = decimate;
