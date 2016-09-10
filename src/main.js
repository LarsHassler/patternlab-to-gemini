/*
 * Copyright (c) 2016 Lars Haßler <mail@LarsHassler.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

const cheerio = require('cheerio');
const extend = require('extend');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const request = require('request');
const debug = require('debug')('patternlab-to-gemini:main');

/**
 * @param {{
 *    screenSizes: Object!
 * }|string} options
 *    Either an options object or a path to a config json file
 * @constructor
 */
var PatternlabToNode = function(options) {
  /**
   * @type {?string}
   * @private
   */
  this.wasLoadedFromConfigFile_ = null;

  var settings = options;
  if (typeof options === 'string') {
    this.wasLoadedFromConfigFile_ = options;
    settings = JSON.parse(fs.readFileSync(options).toString());
  }

  /**
   * @type {{
   *    patternlabUrl: string,
   *    patternConfigFile: string,
   *    excludePatterns: Array.<string|RegExp>
   * }}
   * @private
   */
  this.config_ = extend({
    patternlabUrl: 'http://localhost:3000',
    patternConfigFile: null,
    outputFile: './patternlabTests.js',
    templateFile: path.resolve(__dirname, '../templates/main.ejs'),
    excludePatterns: [],
    defaultSizes: null
  }, settings);

  if (!this.config_.screenSizes) {
    throw new Error('PatternlabToNode - config error - missing screenSizes')
  }

  if (this.config_.defaultSizes) {
    var notdefinedScreens = [];
    this.config_.defaultSizes.forEach((screenSizeId) => {
      if (!this.config_.screenSizes[screenSizeId]) {
        notdefinedScreens.push(screenSizeId);
      }
    });
    if (notdefinedScreens.length) {
      throw new Error(
        'PatternlabToNode - config error - ' +
            'The following default screenSizes are not defined: ' +
            notdefinedScreens.join(', ')
      );
    }
  }
};


/**
 * @private
 */
PatternlabToNode.prototype.init_ = function() {
  return new Promise((resolve) => {
    // transform all strings in excludePatterns config to regular expressions
    this.config_.excludePatterns.forEach((pattern, index) => {
      this.config_.excludePatterns[index] = new RegExp(pattern);
    });
    resolve();
  });
};



/**
 * @return {Promise.<string>}
 * @private
 */
PatternlabToNode.prototype.getStyleguide_ = function() {
  return new Promise((resolve, reject) => {
    debug('starting request for styleguide on ' + this.config_.patternlabUrl);
    request.get(
        this.config_.patternlabUrl + '/styleguide/html/styleguide.html',
        (err, req, body) => {
          if (err) {
            reject(err);
          }
          else if (req.statusCode === 200) {
            debug('styleguide request finished');
            resolve(body);
          }
          else {
            debug('styleguide request finished with unexpected status '
              + req.statusCode);
            var error;
            switch (req.statusCode) {
              case 404:
                error = new Error('PatternlabToNode - scraping error - "' + this.config_.patternlabUrl + '/styleguide/html/styleguide.html" could not be found');
                break;
              default:
                error = new Error('PatternlabToNode - scraping error - unknown error (statusCode was: ' + req.statusCode + ')');
            }
            reject(error);
          }
        }
    );
  });
};



/**
 * @param {string} html
 * @return {Promise.<Array.<{id: string, name: string}>>}
 * @private
 */
PatternlabToNode.prototype.scrapePatternlab_ = function(html) {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);
    const patterns = [];
    debug('scraping html for patterns');
    $('.sg-pattern').each(
        (index, element) => {
          var patternId = $(element).attr('id');
          debug('found pattern: ' + patternId);
          var header = $(element).find('.sg-pattern-title > a');
          var shouldBeExcluded = this.config_.excludePatterns.reduce(
              (previousValue, currentValue) => {
                return previousValue || currentValue.test(patternId);
              }, false);
          if (shouldBeExcluded) {
            debug('pattern "' + patternId + '" will be excluded');
          }
          if (!shouldBeExcluded) {
            patterns.push({
              id: patternId,
              name: header.html().trim()
            });
          }
        }
    );
    var patternWithoutAnId = patterns.filter((pattern) => {
      return !pattern.id || pattern.id === ''
    });
    var error;
    if (patternWithoutAnId.length !== 0) {
      error = new Error('PatternlabToNode - scraping error - pattern without an id found');
      reject(error);
    }
    else if (patterns.length === 0) {
      error = new Error('PatternlabToNode - scraping error - no pattern found');
      reject(error);
    } else {
      debug('collected patterns');
      resolve(patterns);
    }
  });
};


/**
 * @return {string}
 * @private
 */
PatternlabToNode.prototype.getConfigFilePath_ = function() {
  var configFilePath;
  if (this.wasLoadedFromConfigFile_) {
    configFilePath = path.dirname(this.wasLoadedFromConfigFile_);
  } else {
    configFilePath = __dirname;
  }
  return configFilePath;
};


/**
 * @return {Promise.<>}
 * @private
 */
PatternlabToNode.prototype.loadPatternConfig_ = function() {
  return new Promise((resolve, reject) => {
    if (!this.config_.patternConfigFile) {
      debug('no patternConfigFile specified');
      resolve({
        'patterns': {}
      });
      return;
    }

    var error;
    var statConfigFile;
    var configFilePath = path.resolve(
        this.getConfigFilePath_(),
        this.config_.patternConfigFile);

    debug('loading patternConfig from ' + configFilePath);
    try {
      statConfigFile = fs.statSync(configFilePath);
    } catch (err) {
      debug('error while reading file ' + configFilePath);
      debug(err);
      error = new Error('PatternlabToNode - config error - ' +
          'could not find config file "' + this.config_.patternConfigFile + '"');
      reject(error);
      return;
    }

    if (statConfigFile.isFile()) {
      var oldConfig = JSON.parse(fs.readFileSync(configFilePath).toString());
      resolve(oldConfig);
    } else {
      error = new Error('PatternlabToNode - config error - ' +
          'could not find config file "' + this.config_.patternConfigFile + '"');
      reject(error);
    }
  })
};


/**
 * @return {Promise.<>}
 */
PatternlabToNode.prototype.getPatternsConfiguration = function() {
  var newPatterns = {};
  var newPatternIds = [];
  var oldPatternConfig;
  return this.init_()
      .then(() => {
        return this.getStyleguide_();
      })
      .then((html) => {
        return this.scrapePatternlab_(html);
      })
      .then((patterns) => {
        patterns.forEach((pattern) => {
          newPatternIds.push(pattern.id);
          newPatterns[pattern.id] = pattern;
        });
        return this.loadPatternConfig_();
      })
      .then((loadedOldPatternConfig) => {
        debug('loaded patternConfig');
        debug(loadedOldPatternConfig);

        oldPatternConfig = loadedOldPatternConfig;
        var oldPatternIds = Object.keys(oldPatternConfig.patterns);
        var missingPatterns = oldPatternIds.filter(x => newPatternIds.indexOf(x) < 0);

        if (missingPatterns.length) {
          var error = new Error('PatternlabToNode - config error - ' +
            'The following patterns are no longer part of the styleguide: "' +
            missingPatterns.join('", "') +
            '"! Please check if they have been renamed or remove them from the config');
          throw error
        }

        for (var patternId in oldPatternConfig.patterns) {
          /* istanbul ignore else */
          if (oldPatternConfig.patterns.hasOwnProperty(patternId)) {
            newPatterns[patternId] = oldPatternConfig.patterns[patternId];
          }
        }

        return {
          _patternOrder: newPatternIds,
          patterns: newPatterns
        };
      });
};

/**
 * @return {Promise.<>}
 */
PatternlabToNode.prototype.generateTests = function() {
  return this.init_()
      .then(() => {
        debug('init finished');
        return this.getPatternsConfiguration();
      })
      .then((config) => {
        debug('finished generating config');
        debug(config);
        return new Promise((resolve, reject) => {
          var data = {
            'patterns': [],
            'sizes': []
          };
          config._patternOrder.forEach((patternId) => {
            data.patterns.push(config.patterns[patternId]);
          });
          for (var screenSize in this.config_.screenSizes) {
            /* istanbul ignore else */
            if (this.config_.screenSizes.hasOwnProperty(screenSize)) {
              data.sizes.push({
                name: screenSize,
                width: this.config_.screenSizes[screenSize].width,
                height: this.config_.screenSizes[screenSize].height
              });
            }
          }
          var templateFilePath = path.resolve(
              this.getConfigFilePath_(),
              this.config_.templateFile);
          ejs.renderFile(templateFilePath, data, {}, function(err, str) {
            if (err) {
              var error = new Error('PatternlabToNode - rendering error - ' +
                'there was an error while rendering "' + templateFilePath + '"');
              reject(error);
            } else {
              resolve(str);
            }
          });
        });
      })
      .then((fileContent) => {
        var configFilePath = path.resolve(
            this.getConfigFilePath_(),
            this.config_.outputFile);
        fs.writeFileSync(configFilePath, fileContent);
      });
};


module.exports = PatternlabToNode;
