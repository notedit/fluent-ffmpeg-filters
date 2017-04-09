const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the fieldmatch function.
 *
 *
 * @example
 *  ffmpeg().fieldmatch()
      ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the fieldmatch function.
 */
function fieldmatch(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'fieldmatch', function() {
    return new FieldmatchFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class FieldmatchFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    Fieldmatch.prototype.withOrder = order;
    Fieldmatch.prototype.withMode = mode;
    Fieldmatch.prototype.withPpsrc = ppsrc;
    Fieldmatch.prototype.withField = field;
    Fieldmatch.prototype.withMchroma = mchroma;
    Fieldmatch.prototype.withY1 = y1;
    Fieldmatch.prototype.withScthresh = scthresh;
    Fieldmatch.prototype.withCombmatch = combmatch;
    Fieldmatch.prototype.withCombdbg = combdbg;
    Fieldmatch.prototype.withCthresh = cthresh;
    Fieldmatch.prototype.withChroma = chroma;
    Fieldmatch.prototype.withBlocky = blocky;
    Fieldmatch.prototype.withCombpel = combpel;
  }

  /**
   * 
   * @param val
   */
  order(val) {
    this.order = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  mode(val) {
    this.mode = val;
    return this;
  }

  /**
   * Mark the main input stream as a pre-processed input, and enable the secondary
   * input stream as the clean source to pick the fields from. See the filter
   * introduction for more details. It is similar to the clip2 feature from
   * VFM/TFM.
   * 
   * Default value is 0 (disabled).
   * 
   * 
   * @param val
   */
  ppsrc(val) {
    this.ppsrc = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  field(val) {
    this.field = val;
    return this;
  }

  /**
   * Set whether or not chroma is included during the match comparisons. In most
   * cases it is recommended to leave this enabled. You should set this to 0
   * only if your clip has bad chroma problems such as heavy rainbowing or other
   * artifacts. Setting this to 0 could also be used to speed things up at
   * the cost of some accuracy.
   * 
   * Default value is 1.
   * 
   * 
   * @param val
   */
  mchroma(val) {
    this.mchroma = val;
    return this;
  }

  /**
   * These define an exclusion band which excludes the lines between y0 and
   * y1 from being included in the field matching decision. An exclusion
   * band can be used to ignore subtitles, a logo, or other things that may
   * interfere with the matching. y0 sets the starting scan line and
   * y1 sets the ending line; all lines in between y0 and
   * y1 (including y0 and y1) will be ignored. Setting
   * y0 and y1 to the same value will disable the feature.
   * y0 and y1 defaults to 0.
   * 
   * 
   * @param val
   */
  y1(val) {
    this.y1 = val;
    return this;
  }

  /**
   * Set the scene change detection threshold as a percentage of maximum change on
   * the luma plane. Good values are in the [8.0, 14.0] range. Scene change
   * detection is only relevant in case combmatch&#x3D;sc.  The range for
   * scthresh is [0.0, 100.0].
   * 
   * Default value is 12.0.
   * 
   * 
   * @param val
   */
  scthresh(val) {
    this.scthresh = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  combmatch(val) {
    this.combmatch = val;
    return this;
  }

  /**
   * 
   * @param val
   */
  combdbg(val) {
    this.combdbg = val;
    return this;
  }

  /**
   * This is the area combing threshold used for combed frame detection. This
   * essentially controls how &quot;strong&quot; or &quot;visible&quot; combing must be to be detected.
   * Larger values mean combing must be more visible and smaller values mean combing
   * can be less visible or strong and still be detected. Valid settings are from
   * -1 (every pixel will be detected as combed) to 255 (no pixel will
   * be detected as combed). This is basically a pixel difference value. A good
   * range is [8, 12].
   * 
   * Default value is 9.
   * 
   * 
   * @param val
   */
  cthresh(val) {
    this.cthresh = val;
    return this;
  }

  /**
   * Sets whether or not chroma is considered in the combed frame decision.  Only
   * disable this if your source has chroma problems (rainbowing, etc.) that are
   * causing problems for the combed frame detection with chroma enabled. Actually,
   * using chroma&#x3D;0 is usually more reliable, except for the case
   * where there is chroma only combing in the source.
   * 
   * Default value is 0.
   * 
   * 
   * @param val
   */
  chroma(val) {
    this.chroma = val;
    return this;
  }

  /**
   * Respectively set the x-axis and y-axis size of the window used during combed
   * frame detection. This has to do with the size of the area in which
   * combpel pixels are required to be detected as combed for a frame to be
   * declared combed. See the combpel parameter description for more info.
   * Possible values are any number that is a power of 2 starting at 4 and going up
   * to 512.
   * 
   * Default value is 16.
   * 
   * 
   * @param val
   */
  blocky(val) {
    this.blocky = val;
    return this;
  }

  /**
   * The number of combed pixels inside any of the blocky by
   * blockx size blocks on the frame for the frame to be detected as
   * combed. While cthresh controls how &quot;visible&quot; the combing must be, this
   * setting controls &quot;how much&quot; combing there must be in any localized area (a
   * window defined by the blockx and blocky settings) on the
   * frame. Minimum value is 0 and maximum is blocky x blockx (at
   * which point no frames will ever be detected as combed). This setting is known
   * as MI in TFM/VFM vocabulary.
   * 
   * Default value is 80.
   * 
   * @param val
   */
  combpel(val) {
    this.combpel = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this.order) {
      opt.order = this.order;
    }
    if (this.mode) {
      opt.mode = this.mode;
    }
    if (this.ppsrc) {
      opt.ppsrc = this.ppsrc;
    }
    if (this.field) {
      opt.field = this.field;
    }
    if (this.mchroma) {
      opt.mchroma = this.mchroma;
    }
    if (this.y1) {
      opt.y1 = this.y1;
    }
    if (this.scthresh) {
      opt.scthresh = this.scthresh;
    }
    if (this.combmatch) {
      opt.combmatch = this.combmatch;
    }
    if (this.combdbg) {
      opt.combdbg = this.combdbg;
    }
    if (this.cthresh) {
      opt.cthresh = this.cthresh;
    }
    if (this.chroma) {
      opt.chroma = this.chroma;
    }
    if (this.blocky) {
      opt.blocky = this.blocky;
    }
    if (this.combpel) {
      opt.combpel = this.combpel;
    }

    addFilter(this.ffmpeg, {
      filter: 'fieldmatch',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.fieldmatch = fieldmatch;