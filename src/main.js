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

  /**
   * @type {Array.<string>}
   * @private
   */
  this.warnings_ = [];

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
    excludeStates: [],
    defaultSizes: null,
    loadOnSinglePage: false,
    groupTestsByType: false,
    caseSensitive: true,
    patterns: null
  }, settings);

  if (!this.config_.screenSizes) {
    throw new Error('PatternlabToNode - config error - missing screenSizes')
  }

  if (this.config_.patternConfigFile) {
    this.addWarning_(
      'Deprecating Warning: patternConfigFile is deprecated. ' +
          'It will be removed in 1.0.0. Please use "patterns" instead.'
    );
    if (this.config_.patterns) {
      throw new Error('PatternlabToNode - config error - ' +
        'Please use either the patternConfigFile or the patterns settings')
    }
  }

  if (this.config_.defaultSizes) {
    var notDefinedScreens = [];
    this.config_.defaultSizes.forEach((screenSizeId) => {
      if (!this.config_.screenSizes[screenSizeId]) {
        notDefinedScreens.push(screenSizeId);
      }
    });
    if (notDefinedScreens.length) {
      throw new Error(
        'PatternlabToNode - config error - ' +
            'The following default screenSizes are not defined: ' +
            notDefinedScreens.join(', ')
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

    // transform all strings in excludeStates config to regular expressions
    this.config_.excludeStates.forEach((pattern, index) => {
      this.config_.excludeStates[index] = new RegExp(pattern);
    });

    if (!this.config_.defaultSizes) {
      this.config_.defaultSizes = Object.keys(this.config_.screenSizes);
    }
    resolve();
  });
};

/**
 * @param {string} message
 * @private
 */
PatternlabToNode.prototype.addWarning_ = function(message) {
  this.warnings_.push(message);
};


/**
 * @return {Array.<string>}
 * @private
 */
PatternlabToNode.prototype.getWarnings = function() {
  return this.warnings_;
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
          var shouldBeExcluded = false;
          debug('found pattern: ' + patternId);
          var headerElement = $(element).find('.sg-pattern-title > a');
          var header = headerElement.text().trim();
          var stateElement = $(element).find('.sg-pattern-state');
          var state = null;

          /* istanbul ignore else */
          if (stateElement) {
            state = stateElement.text();
            debug('pattern has state: ' + state);
            header = header.split('\n')[0].trim();

            shouldBeExcluded = this.config_.excludeStates.reduce(
              (previousValue, currentValue) => {
                return previousValue || currentValue.test(state);
              }, shouldBeExcluded);
          }
          shouldBeExcluded = this.config_.excludePatterns.reduce(
              (previousValue, currentValue) => {
                return previousValue || currentValue.test(patternId);
              }, shouldBeExcluded);

          if (!shouldBeExcluded && this.config_.excludeImplicit) {
            shouldBeExcluded = !this.config_.patterns[patternId]
          }

          if (shouldBeExcluded) {
            debug('pattern "' + patternId + '" will be excluded');
          }
          if (!shouldBeExcluded) {
            patterns.push({
              id: patternId,
              name: this.config_.caseSensitive === false ? header.toLowerCase() : header,
              url: headerElement.attr('href')
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
    if (this.config_.patterns) {
      debug('returning inlined patterns');
      resolve({
        'patterns': this.config_.patterns
      });
      return;
    }

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


PatternlabToNode.prototype.parseSkipBrowsers = function(pattern) {
  if (pattern.skipBrowsers) {
    if (!(pattern.skipBrowsers instanceof Array)) {
      throw new Error(
        'PatternlabToNode - config error - ' +
        pattern.id + ' skipBrowsers is not an array'
      );
    }

    pattern.skipBrowsers.forEach((browser, index) => {
      if (typeof browser === 'string') {
        pattern.skipBrowsers[index] = {
          regexp: browser,
          comment: "skipped via patternlab-to-gemini config"
        }
      }
      else if (browser instanceof Object) {
        browser.comment = browser.comment ||
          "skipped via patternlab-to-gemini config";
      }
      else {
        throw new Error(
          'PatternlabToNode - config error - ' +
          pattern.id + ' skipBrowsers entry ' + index + ' is not valid'
        );
      }
    })
  }
};


PatternlabToNode.prototype.parseAction = function(pattern) {

  const validActions = ['hover', 'focus', 'sendKeys'];

  /* istanbul ignore else */
  if (pattern.actions &&
    pattern.actions.length) {
    pattern.actions.forEach((action) => {
      if (!action.name) {
        throw new Error(
          'PatternlabToNode - config error - ' +
            pattern.id + ' is missing action name'
        );
      }

      if (!action.action) {
        throw new Error(
          'PatternlabToNode - config error - ' +
            pattern.id + ' is missing action identifier'
        );
      }

      if (action.skipBrowsers) {
        if (!(action.skipBrowsers instanceof Array)) {
          throw new Error(
            'PatternlabToNode - config error - ' +
            pattern.id + ' action "' + action.action + '" skipBrowsers is not an array'
          );
        }

        action.skipBrowsers.forEach((browser, index) => {
          if (typeof browser === 'string') {
            action.skipBrowsers[index] = {
              regexp: browser,
              comment: "skipped via patternlab-to-gemini config"
            }
          }
          else if (browser instanceof Object) {
            browser.comment = browser.comment ||
              "skipped via patternlab-to-gemini config";
          }
          else {
            throw new Error(
              'PatternlabToNode - config error - ' +
              pattern.id + ' action "' + action.action + '" skipBrowsers entry ' + index + ' is not valid'
            );
          }
        })
      }

      action.selector = action.selector || '> *';

      if (this.config_.loadOnSinglePage || pattern.loadOnSinglePage) {
        if (action.selector !== "> *") {
          action.selector = `body ${action.selector}`
        } else {
          throw new Error(
            'PatternlabToNode - config error - ' +
              pattern.id + ' action "' + action.action + '" need selector in "loadOnSinglePage" mode'
          );
        }
      } else {
        action.selector = `#${pattern.id} .sg-pattern-example ${action.selector}`
      }

      if (action.action === 'hover') {
        if (action.pseudoClass) {
          action.steps = `.executeJS(function() {
  window.document.querySelector('${action.selector}').className += ' ${action.pseudoClass}'
})`;
        } else {
          action.steps = '.mouseMove(this.element)';
        }
      }
      else if (action.action === 'focus') {
        action.steps = '.focus(this.element)';
      }
      else if (action.action === 'click') {
        action.steps = '.click(this.element).mouseMove("body", {x:0, y:0})';
      }
      else if (action.action === 'sendKeys') {
        if (!action.keys) {
          throw new Error(
            'PatternlabToNode - config error - ' +
            pattern.id + ' is missing "keys" option required for sendKeys'
          );
        }
        action.steps = '.sendKeys(this.element, \'' + action.keys + '\')';
      }
      else {
        throw new Error(
          'PatternlabToNode - config error - ' +
          pattern.id + ' has unknown action identifier ' +
          '"' + action.action + '", ' +
          'use ("' + validActions.join('", "') + '")'
        );
      }

      if (action.delay) {
        action.steps += '.wait(' + action.delay + ')';
      }
    })
  }
};



/**
 * @return {Promise.<>}
 */
PatternlabToNode.prototype.getPatternsConfiguration = function() {
  const newPatterns = {};
  const newPatternIds = [];
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
            newPatterns[patternId] = extend(
              newPatterns[patternId],
              oldPatternConfig.patterns[patternId]);
          }
        }

      })
      .then(() => {
        const patternsWithOverwritesAndAdditionsOrExlcudes = [];
        const notDefinedScreens = [];
        const removedAllScreens = [];

        for (var patternId in newPatterns) {
          /* istanbul ignore else */
          if (newPatterns.hasOwnProperty(patternId)) {

            this.parseSkipBrowsers(newPatterns[patternId]);

            this.parseAction(newPatterns[patternId]);

            // check if both screenSizes and overwritten or modified screen
            // sizes are defined
            if ((newPatterns[patternId].screenSizes &&
              newPatterns[patternId].additionalScreenSizes) ||
              (newPatterns[patternId].screenSizes &&
                newPatterns[patternId].excludeScreenSizes)) {
              patternsWithOverwritesAndAdditionsOrExlcudes.push(patternId);
            }

            // check if there are undefined screen sizes
            var screenSizes = [].concat(
              newPatterns[patternId].screenSizes || [],
              newPatterns[patternId].additionalScreenSizes || [],
              newPatterns[patternId].excludeScreenSizes || []
            );

            if (newPatterns[patternId].screenSizes &&
                newPatterns[patternId].screenSizes.length === 0) {
              removedAllScreens.push(patternId);
              continue;
            }

            if (screenSizes.length === 0) {
              newPatterns[patternId].screenSizes = this.config_.defaultSizes;
            } else {
              screenSizes.forEach((screenSizeId) => {
                /* istanbul ignore else */
                if (!this.config_.screenSizes[screenSizeId]) {
                  notDefinedScreens.push(screenSizeId);
                }
              });

              if (!newPatterns[patternId].screenSizes) {
                const defaultSizesCopy = this.config_.defaultSizes.slice(0);
                if (newPatterns[patternId].additionalScreenSizes) {
                  newPatterns[patternId].additionalScreenSizes.forEach((key) => {
                    defaultSizesCopy.push(
                      key
                    );
                  });
                }
                if (newPatterns[patternId].excludeScreenSizes) {
                  newPatterns[patternId].excludeScreenSizes.forEach((key) => {
                    var pos = defaultSizesCopy.indexOf(key);
                    if (pos !== -1) {
                      defaultSizesCopy.splice(
                        pos, 1
                      );
                    }
                  });
                }

                if (defaultSizesCopy.length === 0) {
                  removedAllScreens.push(patternId);
                }
                newPatterns[patternId].screenSizes = defaultSizesCopy;
              }
            }
          }
        }

        if (notDefinedScreens.length) {
          throw new Error(
            'PatternlabToNode - config error - ' +
            'The following screenSizes are used in patterns, but are not defined: ' +
            notDefinedScreens.join(', ')
          );
        }

        if (removedAllScreens.length) {
          throw new Error(
            'PatternlabToNode - config error - ' +
            'The following patterns have no screens: ' +
            removedAllScreens.join(', ')
          );
        }

        if (patternsWithOverwritesAndAdditionsOrExlcudes.length) {
          throw new Error(
            'PatternlabToNode - config error - ' +
            'The following patterns have both overwrites and additionalScreenSizes or excludeScreenSizes defined: ' +
            patternsWithOverwritesAndAdditionsOrExlcudes.join(', ') + ' ' +
            'please fix the configuration to use either overwrites or additionalScreenSizes/excludeScreenSizes'
          );
        }
      })
      .then(() => {
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
            'config': {
              loadOnSinglePage: this.config_.loadOnSinglePage
            },
            'suites': [],
            'patterns': {}
          };
          config._patternOrder.forEach((patternId) => {
            var loadOnSinglePage = this.config_.loadOnSinglePage ||
              config.patterns[patternId].loadOnSinglePage;
            var actions = config.patterns[patternId].actions || [];
            actions.forEach(action => {
              action.skipBrowsers = action.skipBrowsers || [];
            });

            var captureElements;
            if (loadOnSinglePage) {
              captureElements = '\'body\''
            } else {
              captureElements = '[\'#' + patternId + ' .sg-pattern-example\']';
            }
            if (config.patterns[patternId].captureElements) {
              captureElements = '[\'' +
                config.patterns[patternId].captureElements.join('\', \'') + '\']'
            }
            let ignoreElements = null
            if (config.patterns[patternId].ignoreElements) {
              ignoreElements = JSON.stringify(
                config.patterns[patternId].ignoreElements
                  .map(selector => { return { every: selector } })
              )
            }
            var patternSettings = {
              'id': patternId,
              'loadOnSinglePage': loadOnSinglePage,
              'name': config.patterns[patternId].name,
              'url': '/styleguide/html/' + config.patterns[patternId].url,
              'actions': actions,
              'captureElements': captureElements,
              'ignoreElements': ignoreElements,
              'skipBrowsers': config.patterns[patternId].skipBrowsers || [],
              'sizes': []
            };
            config.patterns[patternId].screenSizes.forEach((screenSizeId) => {
              patternSettings.sizes.push({
                name: screenSizeId,
                width: this.config_.screenSizes[screenSizeId].width,
                height: this.config_.screenSizes[screenSizeId].height
              });
            });

            var suiteName = 'Patternlab';
            if (this.config_.groupTestsByType) {
              var patternMatch = patternId.match(/^[^-]*/)[0];
              suiteName = patternMatch.charAt(0).toUpperCase() +
                  patternMatch.slice(1);
            }

            if (!data.patterns[suiteName]) {
              data.suites.push(suiteName);
              data.patterns[suiteName] = [];
            }
            data.patterns[suiteName].push(patternSettings);
          });
          var templateFilePath = path.resolve(
              this.getConfigFilePath_(),
              this.config_.templateFile);
          ejs.renderFile(templateFilePath, data, {}, function(err, str) {
            if (err) {
              debug(err);
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
