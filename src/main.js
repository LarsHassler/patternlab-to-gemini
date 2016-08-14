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

/**
 * @param {(Object|string)=} opt_options
 *    Either an options object or a path to a config json file
 * @constructor
 */
var PatternlabToNode = function(opt_options) {
  /**
   * @type {?string}
   * @private
   */
  this.wasLoadedFromConfigFile_ = null;

  if (typeof opt_options == 'string') {
    this.wasLoadedFromConfigFile_ = opt_options;
    opt_options = JSON.parse(fs.readFileSync(opt_options).toString());
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
    patternConfigFile: './pattern.config.json',
    outputFile: './patternlabTests.js',
    templateFile: './templates/main.ejs',
    excludePatterns: []
  }, opt_options);

  if (!this.config_['screenSizes']) {
    throw new Error('PatternlabToNode - config error - missing screenSizes')
  }
};


/**
 * @private
 */
PatternlabToNode.
    prototype.init_ = function() {
  return new Promise((resolve, reject) => {
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
PatternlabToNode.
    prototype.getStyleguide_ = function() {
  return new Promise((resolve, reject) => {
    request.get(
        this.config_['patternlabUrl'] + '/styleguide/html/styleguide.html',
        (err, request, body) => {
          if (err) {
            reject(err);
          }
          else if (request.statusCode === 200) {
            resolve(body);
          }
          else {
            var error;
            switch (request.statusCode) {
              case 404:
                error = new Error('PatternlabToNode - scraping error - "' + (this.config_['patternlabUrl'] + '/styleguide/html/styleguide.html') + '" could not be found');
                break;
              default:
                error = new Error('PatternlabToNode - scraping error - unknown error (statusCode was: ' + request.statusCode + ')');
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
PatternlabToNode.
    prototype.scrapePatternlab_ = function(html) {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html);
    const patterns = [];
    $('.sg-pattern').each(
        (index, element) => {
          var patternId = $(element).attr('id');
          var header = $(element).find('.sg-pattern-title > a');
          var shouldBeExcluded = this.config_.excludePatterns.reduce(
              (previousValue, currentValue, currentIndex) => {
                return previousValue || currentValue.test(patternId);
              }, false);
          if (!shouldBeExcluded) {
            patterns.push(
                {
                  id: patternId,
                  name: header.html().trim()
                }
            );
          }
        }
    );
    var patternWithoutAnId = patterns.filter((pattern) => {
      return !pattern.id || pattern.id == ''
    });
    if (patternWithoutAnId.length != 0) {
      var error = new Error('PatternlabToNode - scraping error - pattern without an id found');
      reject(error);
    }
    else if (patterns.length == 0) {
      var error = new Error('PatternlabToNode - scraping error - no pattern found');
      reject(error);
    } else {
      resolve(patterns);
    }
  });
};


/**
 * @return {string}
 * @private
 */
PatternlabToNode.
    prototype.getConfigFilePath_ = function() {
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
PatternlabToNode.
    prototype.loadOldPatternConfig_ = function() {
  return new Promise((resolve, reject) => {
    var configFilePath = path.resolve(
        this.getConfigFilePath_(),
        this.config_.patternConfigFile);
    try {
      var statConfigFile = fs.statSync(configFilePath);
    } catch(err) {
      var error = new Error('PatternlabToNode - config error - ' +
          'could not find config file "' + this.config_.patternConfigFile + '"');
      reject(error);
    }

    if (statConfigFile.isFile()) {
      var oldConfig = JSON.parse(fs.readFileSync(configFilePath).toString());
      resolve(oldConfig);
    } else {
      var error = new Error('PatternlabToNode - config error - ' +
          'could not find config file "' + this.config_.patternConfigFile + '"');
      reject(error);
    }
  })
};


/**
 * @return {Promise.<>}
 */
PatternlabToNode.
    prototype.getPatternsConfiguration = function() {
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
          newPatternIds.push(pattern['id']);
          newPatterns[pattern['id']] = pattern;
        });
        return this.loadOldPatternConfig_();
      })
      .then((loadedOldPatternConfig) => {
        oldPatternConfig = loadedOldPatternConfig;
        var oldPatternIds = Object.keys(oldPatternConfig['patterns']);
        var missingPatterns = oldPatternIds.filter(x => newPatternIds.indexOf(x) < 0 );

        if (missingPatterns.length) {
          this.logMessage_(
              'The following Patterns are no longer part of the styleguide: ' +
                  missingPatterns.join(', ')
          )
        }

        for(var patternId in oldPatternConfig['patterns']) {
          newPatterns[patternId] = oldPatternConfig['patterns'][patternId];
        }
      })
      .then(() => {
        var configFilePath = path.resolve(
            this.getConfigFilePath_(),
            this.config_.patternConfigFile);
        fs.writeFileSync(configFilePath + '.bak', JSON.stringify(oldPatternConfig));
      })
      .then(() => {
        var configFilePath = path.resolve(
            this.getConfigFilePath_(),
            this.config_.patternConfigFile);
        fs.writeFileSync(configFilePath, JSON.stringify({
          _patternOrder: newPatternIds,
          patterns: newPatterns
        }));
      });
};


/**
 * @param {string} message
 * @private
 */
PatternlabToNode.
    prototype.logMessage_ = function(message) {
  console.log(message);
};





module.exports = PatternlabToNode;
