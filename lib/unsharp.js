const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the unsharp function.
 *
 *
 * @example
 *  ffmpeg().unsharp()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the unsharp function.
 */
function unsharp(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'unsharp', function() {
    return new UnsharpFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class UnsharpFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    UnsharpFilter.prototype.withLuma_msize_x = this.luma_msize_x;
    UnsharpFilter.prototype.withLuma_msize_y = this.luma_msize_y;
    UnsharpFilter.prototype.withLuma_amount = this.luma_amount;
    UnsharpFilter.prototype.withChroma_msize_x = this.chroma_msize_x;
    UnsharpFilter.prototype.withChroma_msize_y = this.chroma_msize_y;
    UnsharpFilter.prototype.withChroma_amount = this.chroma_amount;
    UnsharpFilter.prototype.withOpencl = this.opencl;
  }

  /**
   * Set the luma matrix horizontal size. It must be an odd integer between
   * 3 and 23. The default value is 5.
   * 
   * 
   * @param val
   */
  luma_msize_x(val) {
    this._luma_msize_x = val;
    return this;
  }

  /**
   * Set the luma matrix vertical size. It must be an odd integer between 3
   * and 23. The default value is 5.
   * 
   * 
   * @param val
   */
  luma_msize_y(val) {
    this._luma_msize_y = val;
    return this;
  }

  /**
   * Set the luma effect strength. It must be a floating point number, reasonable
   * values lay between -1.5 and 1.5.
   * 
   * Negative values will blur the input video, while positive values will
   * sharpen it, a value of zero will disable the effect.
   * 
   * Default value is 1.0.
   * 
   * 
   * @param val
   */
  luma_amount(val) {
    this._luma_amount = val;
    return this;
  }

  /**
   * Set the chroma matrix horizontal size. It must be an odd integer
   * between 3 and 23. The default value is 5.
   * 
   * 
   * @param val
   */
  chroma_msize_x(val) {
    this._chroma_msize_x = val;
    return this;
  }

  /**
   * Set the chroma matrix vertical size. It must be an odd integer
   * between 3 and 23. The default value is 5.
   * 
   * 
   * @param val
   */
  chroma_msize_y(val) {
    this._chroma_msize_y = val;
    return this;
  }

  /**
   * Set the chroma effect strength. It must be a floating point number, reasonable
   * values lay between -1.5 and 1.5.
   * 
   * Negative values will blur the input video, while positive values will
   * sharpen it, a value of zero will disable the effect.
   * 
   * Default value is 0.0.
   * 
   * 
   * @param val
   */
  chroma_amount(val) {
    this._chroma_amount = val;
    return this;
  }

  /**
   * If set to 1, specify using OpenCL capabilities, only available if
   * FFmpeg was configured with --enable-opencl. Default value is 0.
   * 
   * 
   * @param val
   */
  opencl(val) {
    this._opencl = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._luma_msize_x) {
      opt['luma_msize_x'] = this._luma_msize_x;
    }
    if (this._luma_msize_y) {
      opt['luma_msize_y'] = this._luma_msize_y;
    }
    if (this._luma_amount) {
      opt['luma_amount'] = this._luma_amount;
    }
    if (this._chroma_msize_x) {
      opt['chroma_msize_x'] = this._chroma_msize_x;
    }
    if (this._chroma_msize_y) {
      opt['chroma_msize_y'] = this._chroma_msize_y;
    }
    if (this._chroma_amount) {
      opt['chroma_amount'] = this._chroma_amount;
    }
    if (this._opencl) {
      opt['opencl'] = this._opencl;
    }

    addFilter(this.ffmpeg, {
      filter: 'unsharp',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.unsharp = unsharp;
