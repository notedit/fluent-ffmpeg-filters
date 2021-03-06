const addFilter = require('./utils').addFilter;
const registerFilter = require('./utils').registerFilter;

/**
 * Augment FfmpegCommand with the ladspa function.
 *
 *
 * @example
 *  ffmpeg().ladspa()
 *    ...             // call filter configuration functions
 *    .build()        // end filter configuration
 *    ...
 *    .applyFilters() // called once all filters have been configured
 *
 * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
 * @return {FfmpegCommand} The ffmpegCommand augmented with the ladspa function.
 */
function ladspa(ffmpegCommand) {
  registerFilter(ffmpegCommand, 'ladspa', function() {
    return new LadspaFilter(this);
  });
  return ffmpegCommand;
}

/**
 * Class exposing methods to configure the vstack filter in a builder pattern way.
 *
 * See {@link http://ffmpeg.org/ffmpeg-filters.html#vstack} for a description
 * of each configuration option.
 */
class LadspaFilter {
  /**
   * @param  {FfmpegCommand} ffmpegCommand The fluent-ffmpeg constructor.
   */
  constructor (ffmpeg) {
    this.ffmpeg = ffmpeg;
    LadspaFilter.prototype.withFile = this.file;
    LadspaFilter.prototype.withPlugin = this.plugin;
    LadspaFilter.prototype.withControls = this.controls;
    LadspaFilter.prototype.withSample_rate = this.sample_rate;
    LadspaFilter.prototype.withNb_samples = this.nb_samples;
    LadspaFilter.prototype.withDuration = this.duration;
  }

  /**
   * Specifies the name of LADSPA plugin library to load. If the environment
   * variable LADSPA_PATH is defined, the LADSPA plugin is searched in
   * each one of the directories specified by the colon separated list in
   * LADSPA_PATH, otherwise in the standard LADSPA paths, which are in
   * this order: HOME/.ladspa/lib/, /usr/local/lib/ladspa/,
   * /usr/lib/ladspa/.
   * 
   * 
   * @param val
   */
  file(val) {
    this._file = val;
    return this;
  }

  /**
   * Specifies the plugin within the library. Some libraries contain only
   * one plugin, but others contain many of them. If this is not set filter
   * will list all available plugins within the specified library.
   * 
   * 
   * @param val
   */
  plugin(val) {
    this._plugin = val;
    return this;
  }

  /**
   * Set the ’|’ separated list of controls which are zero or more floating point
   * values that determine the behavior of the loaded plugin (for example delay,
   * threshold or gain).
   * Controls need to be defined using the following syntax:
   * c0&#x3D;value0|c1&#x3D;value1|c2&#x3D;value2|..., where
   * valuei is the value set on the i-th control.
   * Alternatively they can be also defined using the following syntax:
   * value0|value1|value2|..., where
   * valuei is the value set on the i-th control.
   * If controls is set to help, all available controls and
   * their valid ranges are printed.
   * 
   * 
   * @param val
   */
  controls(val) {
    this._controls = val;
    return this;
  }

  /**
   * Specify the sample rate, default to 44100. Only used if plugin have
   * zero inputs.
   * 
   * 
   * @param val
   */
  sample_rate(val) {
    this._sample_rate = val;
    return this;
  }

  /**
   * Set the number of samples per channel per each output frame, default
   * is 1024. Only used if plugin have zero inputs.
   * 
   * 
   * @param val
   */
  nb_samples(val) {
    this._nb_samples = val;
    return this;
  }

  /**
   * Set the minimum duration of the sourced audio. See
   * (ffmpeg-utils)the Time duration section in the ffmpeg-utils(1) manual
   * for the accepted syntax.
   * Note that the resulting duration may be greater than the specified duration,
   * as the generated audio is always cut at the end of a complete frame.
   * If not specified, or the expressed duration is negative, the audio is
   * supposed to be generated forever.
   * Only used if plugin have zero inputs.
   * 
   * 
   * @param val
   */
  duration(val) {
    this._duration = val;
    return this;
  }


  /**
   * Creates this filter configuration and registers it in the ffmpeg instance.
   * @return {ffmpegCommand} The ffmpeg instance.
   */
  build() {
    let opt = {};
    if (this._file) {
      opt['file'] = this._file;
    }
    if (this._plugin) {
      opt['plugin'] = this._plugin;
    }
    if (this._controls) {
      opt['controls'] = this._controls;
    }
    if (this._sample_rate) {
      opt['sample_rate'] = this._sample_rate;
    }
    if (this._nb_samples) {
      opt['nb_samples'] = this._nb_samples;
    }
    if (this._duration) {
      opt['duration'] = this._duration;
    }

    addFilter(this.ffmpeg, {
      filter: 'ladspa',
      options: opt
    });
    return this.ffmpeg;
  }
}

module.exports.ladspa = ladspa;
