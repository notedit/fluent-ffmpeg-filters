const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the signature function.
 *
 *
 * @example
 *  ffmpeg().signature()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the signature function.
 */
function signature(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'signature', function() {
    return new SignatureFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class SignatureFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    SignatureFilter.prototype.withDetectmode = this.detectmode;
    SignatureFilter.prototype.withNb_inputs = this.nb_inputs;
    SignatureFilter.prototype.withFilename = this.filename;
    SignatureFilter.prototype.withFormat = this.format;
    SignatureFilter.prototype.withTh_d = this.th_d;
    SignatureFilter.prototype.withTh_dc = this.th_dc;
    SignatureFilter.prototype.withTh_xh = this.th_xh;
    SignatureFilter.prototype.withTh_di = this.th_di;
    SignatureFilter.prototype.withTh_it = this.th_it;
  }

  /**
   * 
   * @param val
   */
  detectmode(val) {
    this._detectmode = val;
    return this;
  }

  /**
   * Set the number of inputs. The option value must be a non negative integer.
   * Default value is 1.
   * 
   * 
   * @param val
   */
  nb_inputs(val) {
    this._nb_inputs = val;
    return this;
  }

  /**
   * Set the path to which the output is written. If there is more than one input,
   * the path must be a prototype, i.e. must contain %d or %0nd (where n is a positive
   * integer), that will be replaced with the input number. If no filename is
   * specified, no output will be written. This is the default.
   * 
   * 
   * @param val
   */
  filename(val) {
    this._filename = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  format(val) {
    this._format = val;
    return this;
  }

  /**
   * Set threshold to detect one word as similar. The option value must be an integer
   * greater than zero. The default value is 9000.
   * 
   * 
   * @param val
   */
  th_d(val) {
    this._th_d = val;
    return this;
  }

  /**
   * Set threshold to detect all words as similar. The option value must be an integer
   * greater than zero. The default value is 60000.
   * 
   * 
   * @param val
   */
  th_dc(val) {
    this._th_dc = val;
    return this;
  }

  /**
   * Set threshold to detect frames as similar. The option value must be an integer
   * greater than zero. The default value is 116.
   * 
   * 
   * @param val
   */
  th_xh(val) {
    this._th_xh = val;
    return this;
  }

  /**
   * Set the minimum length of a sequence in frames to recognize it as matching
   * sequence. The option value must be a non negative integer value.
   * The default value is 0.
   * 
   * 
   * @param val
   */
  th_di(val) {
    this._th_di = val;
    return this;
  }

  /**
   * Set the minimum relation, that matching frames to all frames must have.
   * The option value must be a double value between 0 and 1. The default value is 0.5.
   * 
   * @param val
   */
  th_it(val) {
    this._th_it = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._detectmode) {
      opt['detectmode'] = this._detectmode;
    }
    if (this._nb_inputs) {
      opt['nb_inputs'] = this._nb_inputs;
    }
    if (this._filename) {
      opt['filename'] = this._filename;
    }
    if (this._format) {
      opt['format'] = this._format;
    }
    if (this._th_d) {
      opt['th_d'] = this._th_d;
    }
    if (this._th_dc) {
      opt['th_dc'] = this._th_dc;
    }
    if (this._th_xh) {
      opt['th_xh'] = this._th_xh;
    }
    if (this._th_di) {
      opt['th_di'] = this._th_di;
    }
    if (this._th_it) {
      opt['th_it'] = this._th_it;
    }

    addFilter(this.ffmpeg, {
      filter: 'signature',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.signature = signature;
