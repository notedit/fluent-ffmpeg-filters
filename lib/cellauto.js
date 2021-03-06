const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the cellauto function.
 *
 *
 * @example
 *  ffmpeg().cellauto()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the cellauto function.
 */
function cellauto(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'cellauto', function() {
    return new CellautoFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class CellautoFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    CellautoFilter.prototype.withFilename = this.filename;
    CellautoFilter.prototype.withPattern = this.pattern;
    CellautoFilter.prototype.withRate = this.rate;
    CellautoFilter.prototype.withRandom_fill_ratio = this.random_fill_ratio;
    CellautoFilter.prototype.withRandom_seed = this.random_seed;
    CellautoFilter.prototype.withRule = this.rule;
    CellautoFilter.prototype.withSize = this.size;
    CellautoFilter.prototype.withScroll = this.scroll;
    CellautoFilter.prototype.withStart_full = this.start_full;
    CellautoFilter.prototype.withStitch = this.stitch;
  }

  /**
   * Read the initial cellular automaton state, i.e. the starting row, from
   * the specified file.
   * In the file, each non-whitespace character is considered an alive
   * cell, a newline will terminate the row, and further characters in the
   * file will be ignored.
   * 
   * 
   * @param val
   */
  filename(val) {
    this._filename = val;
    return this;
  }

  /**
   * Read the initial cellular automaton state, i.e. the starting row, from
   * the specified string.
   * 
   * Each non-whitespace character in the string is considered an alive
   * cell, a newline will terminate the row, and further characters in the
   * string will be ignored.
   * 
   * 
   * @param val
   */
  pattern(val) {
    this._pattern = val;
    return this;
  }

  /**
   * Set the video rate, that is the number of frames generated per second.
   * Default is 25.
   * 
   * 
   * @param val
   */
  rate(val) {
    this._rate = val;
    return this;
  }

  /**
   * Set the random fill ratio for the initial cellular automaton row. It
   * is a floating point number value ranging from 0 to 1, defaults to
   * 1/PHI.
   * 
   * This option is ignored when a file or a pattern is specified.
   * 
   * 
   * @param val
   */
  random_fill_ratio(val) {
    this._random_fill_ratio = val;
    return this;
  }

  /**
   * Set the seed for filling randomly the initial row, must be an integer
   * included between 0 and UINT32_MAX. If not specified, or if explicitly
   * set to -1, the filter will try to use a good random seed on a best
   * effort basis.
   * 
   * 
   * @param val
   */
  random_seed(val) {
    this._random_seed = val;
    return this;
  }

  /**
   * Set the cellular automaton rule, it is a number ranging from 0 to 255.
   * Default value is 110.
   * 
   * 
   * @param val
   */
  rule(val) {
    this._rule = val;
    return this;
  }

  /**
   * Set the size of the output video. For the syntax of this option, check the
   * (ffmpeg-utils)&quot;Video size&quot; section in the ffmpeg-utils manual.
   * 
   * If filename or pattern is specified, the size is set
   * by default to the width of the specified initial state row, and the
   * height is set to width * PHI.
   * 
   * If size is set, it must contain the width of the specified
   * pattern string, and the specified pattern will be centered in the
   * larger row.
   * 
   * If a filename or a pattern string is not specified, the size value
   * defaults to &quot;320x518&quot; (used for a randomly generated initial state).
   * 
   * 
   * @param val
   */
  size(val) {
    this._size = val;
    return this;
  }

  /**
   * If set to 1, scroll the output upward when all the rows in the output
   * have been already filled. If set to 0, the new generated row will be
   * written over the top row just after the bottom row is filled.
   * Defaults to 1.
   * 
   * 
   * @param val
   */
  scroll(val) {
    this._scroll = val;
    return this;
  }

  /**
   * If set to 1, completely fill the output with generated rows before
   * outputting the first frame.
   * This is the default behavior, for disabling set the value to 0.
   * 
   * 
   * @param val
   */
  start_full(val) {
    this._start_full = val;
    return this;
  }

  /**
   * If set to 1, stitch the left and right row edges together.
   * This is the default behavior, for disabling set the value to 0.
   * 
   * @param val
   */
  stitch(val) {
    this._stitch = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._filename) {
      opt['filename'] = this._filename;
    }
    if (this._pattern) {
      opt['pattern'] = this._pattern;
    }
    if (this._rate) {
      opt['rate'] = this._rate;
    }
    if (this._random_fill_ratio) {
      opt['random_fill_ratio'] = this._random_fill_ratio;
    }
    if (this._random_seed) {
      opt['random_seed'] = this._random_seed;
    }
    if (this._rule) {
      opt['rule'] = this._rule;
    }
    if (this._size) {
      opt['size'] = this._size;
    }
    if (this._scroll) {
      opt['scroll'] = this._scroll;
    }
    if (this._start_full) {
      opt['start_full'] = this._start_full;
    }
    if (this._stitch) {
      opt['stitch'] = this._stitch;
    }

    addFilter(this.ffmpeg, {
      filter: 'cellauto',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.cellauto = cellauto;
