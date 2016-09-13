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

/* ------------------------------------------------------------------
 * dependency
 * --------------------------------------------------------------- */

const assert = require('chai').assert;
const exampleConfig = require('../example.config.json');
const fs = require('fs');
const mock_fs = require('mock-fs');
const nock = require('nock');
const path = require('path');
const rewire = require('rewire');

const patternlabToNode = rewire('../src/main');


describe('main - ', () => {

  var rewiresToRevert = [];

  /* ------------------------------------------------------------------
   * Setup & Tear down
   * --------------------------------------------------------------- */

  before(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.disableNetConnect();
    mock_fs.restore();
    rewiresToRevert.forEach((revertFunction) => {
      revertFunction();
    })
  });

  after(() => {
    nock.enableNetConnect();
  });

  /* ------------------------------------------------------------------
   * Test cases
   * --------------------------------------------------------------- */

  describe('config - ', () => {

    describe('defaults - ', () => {

      it('default pattern lab url should point to local host on port 3000',
          defaultPatternlabUrlShouldPointToLocalhostOnPort3000
      );

      it('default outputFile should point to file',
          defaultoutputFileShouldPointToFile
      );

      it('default templateFile should point to file',
          defaultTemplateFileShouldPointToFile
      );

    });

    describe('screen sizes - ', function() {

      it('should fail if there are no screen sizes defined',
        shouldFailIfThereAreNoScreenSizesDefined
      );

      it('should fail if a screen size was referenced which is not defined',
        shouldFailIfAScreenSizeWasReferencedWhichIsNotDefined
      );

    });

    // TODO remove in 1.0.0
    it('should fail if patterns and patternConfigFile are defined',
      shouldFailIfPatternsAndPatternConfigFileAreDefined
    );

    it('should overwrite the configuration with a given config object',
        shouldOverwriteTheConfigurationWithAGivenConfigObject
    );

    it('should overwrite the configuration with a given filename',
        shouldOverwriteTheConfigurationWithAGivenFilename
    );

    it('should exclude no pattern by default',
        shouldExcludeNoPatternByDefault
    );

  });

  describe('internals - ', () => {

    describe('init_ - ', () => {

      it('should transform all exclude configs in regexp',
          shouldTransformAllExcludeConfigsInRegexp
      );

    });

    describe('getStyleguide_ - ', () => {

      it('should reject if the request was not successfull',
          shouldRejectIfTheRequestWasNotSuccessfull
      );

      it('should reject if the styleguid could not be found',
          shouldRejectIfTheStyleguidCouldNotBeFound
      );

      it('should reject for all unkown status codes',
          shouldRejectForAllUnkownStatusCodes
      );

      it('should resolve with the body of the response',
          shouldResolveWithTheBodyOfTheResponse
      );

    });

    describe('scrapePatternlab_ - ', () => {

      it('should reject if there were no pattern in the given html',
          shouldRejectIfThereWereNoPatternInTheGivenHTML
      );

      it('should reject if there is a pattern without an id',
          shouldRejectIfThereIsAPatternWithoutAnId
      );

      it('should return all pattern within the html',
          shouldReturnAllPatternWithinTheHTML
      );

    });

  });


  describe('getPatternsConfiguration - ', () => {

    // TODO remove in 1.0.0
    it('should reject if the config file does not exist',
        shouldRejectIfTheConfigFileDoesNotExist
    );

    // TODO remove in 1.0.0
    it('should reject if the config file is a directory',
        shouldRejectIfTheConfigFileIsADirectory
    );

    // TODO remove in 1.0.0
    it('should read the patterconfig relative to the config file',
        shouldReadThePatterconfigRelativeToTheConfigFile
    );

    it('should show a deprecation warning if the patternfile has been defined'// shouldShowADeprecationWarningIfThePatternfileHasBeenDefined
    );

    it('should load patterns from pattern config file',
      shouldLoadPatternsFromPatternConfigFile
    );

    it('should not return patters that match one of the exclude regexps',
        shouldNotReturnPattersThatMatchOneOfTheExcludeRegexps
    );

    it('should reject if patterns which are in the patternConfig are missing in the styleguide',
      shouldRejectIfPatternsWhichAreInThePatternConfigAreMissingInTheStyleguide
    );

    it('should merge old and new patterns',
        shouldMergeOldAndNewPatterns
    );

    it('should reject if a custom screen size was found but not defined',
      shouldRejectIfACustomScreenSizeWasFoundButNotDefined
    );

    it('should reject if a pattern has both size overwrites and additions or excludes',
      shouldRejectIfAPatternHasBothSizeOverwritesAndAdditionsOrExcludes
    );

    it('should reject if a pattern excludes all screenSizes',
      shouldRejectIfAPatternExcludesAllScreenSizes
    );

    it('should reject if a pattern overwrites with empty ScreenSizes',
      shouldRejectIfAPatternOverwirtesWithEmptyScreenSizes
    );

    it('should add additional screen sizes',
      shouldAddAdditionalScreenSizes
    );

    it('should remove screen sizes',
      shouldRemoveScreenSizes
    );

    it('should overwrite screen sizes',
      shouldOverwriteScreenSizes
    );

  });

  describe('generateTests - ', function() {

    it('should reject if there was an error while rendering the template',
        shouldRejectIfThereWasAnErrorWhileRenderingTheTemplate
    );

    it('should generate the correct test file',
        shouldGenerateTheCorrectTestFile
    );

    it('should work with defined screen sizes and a subset as defaults',
      shouldWorkWithDefinedScreenSizesAndDefaults
    );

    it('should work with specific pattern sizes',
      shouldWorkWithSpecificPatternSizes
    );

  });


  /* ------------------------------------------------------------------
   * Test case implementation
   * --------------------------------------------------------------- */

  function shouldRejectIfThereWasAnErrorWhileRenderingTheTemplate(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/notExisitingTemplateFile.json')
    });
    var instanceToTest = new patternlabToNode(
        'config.json'
    );
    instanceToTest.getPatternsConfiguration = function() {
      return new Promise((resolve) => {
        resolve({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              "id": "pattern-1",
              "name": "Pattern Name 1",
              "screenSizes": ["desktop", "tablet"]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop", "tablet"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        throw new Error('should not resolve')
      }, (error) => {
        assert.equal('PatternlabToNode - rendering error - there was an error while rendering "' + path.resolve('noExistingTemplateFile') + '"', error.message);
      })
      .then(done, done);
  }

  function shouldGenerateTheCorrectTestFile(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/generateTestsConfig.json'),
      "expectedTest.js": path.resolve(__dirname, 'expectedTestFiles/generateTests.js'),
      "templates/main.ejs": path.resolve(__dirname, '../templates/main.ejs')
    });
    var instanceToTest = new patternlabToNode('config.json');
    instanceToTest.getPatternsConfiguration = function() {
      return new Promise((resolve) => {
        resolve({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              "id": "pattern-1",
              "name": "Pattern Name 1",
              "screenSizes": ["desktop", "tablet"]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop", "tablet"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        assert.equal(
            fs.readFileSync('patternlabTests.js').toString(),
            fs.readFileSync('expectedTest.js').toString(),
            "wrong testFile generated"
        )
      })
      .then(done, done);
  }

  function shouldWorkWithDefinedScreenSizesAndDefaults(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/definedSubsetScreensizes.json'),
      "expectedTest.js": path.resolve(__dirname, 'expectedTestFiles/generateTests.js'),
      "templates/main.ejs": path.resolve(__dirname, '../templates/main.ejs')
    });
    var instanceToTest = new patternlabToNode('config.json');
    instanceToTest.getPatternsConfiguration = function() {
      return new Promise((resolve) => {
        resolve({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              "id": "pattern-1",
              "name": "Pattern Name 1",
              "screenSizes": ["desktop", "tablet"]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop", "tablet"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        assert.equal(
            fs.readFileSync('patternlabTests.js').toString(),
            fs.readFileSync('expectedTest.js').toString(),
            "wrong testFile generated"
        )
      })
      .then(done, done);
  }

  function shouldWorkWithSpecificPatternSizes(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/definedPatternScreensizes.json'),
      "expectedTest.js": path.resolve(__dirname, 'expectedTestFiles/generateTestsPatternScreensizes.js'),
      "templates/main.ejs": path.resolve(__dirname, '../templates/main.ejs')
    });
    var instanceToTest = new patternlabToNode('config.json');
    instanceToTest.getPatternsConfiguration = function() {
      return new Promise((resolve) => {
        resolve({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              "id": "pattern-1",
              "name": "Pattern Name 1",
              "screenSizes": ["desktop"]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop", "tablet"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        assert.equal(
            fs.readFileSync('patternlabTests.js').toString(),
            fs.readFileSync('expectedTest.js').toString(),
            "wrong testFile generated"
        )
      })
      .then(done, done);
  }

  function shouldRejectIfTheConfigFileDoesNotExist(done) {
    setUpFsMock({
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });

    var instanceToTest = new patternlabToNode({
      "patternConfigFile": "./noExtits",
      "screenSizes": {},
      "excludePatterns": [
        'exclude'
      ]
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        throw new Error('should not resolve');
      }, (error) => {
        assert.equal(
            'PatternlabToNode - config error - could not find config file ' +
            '"./noExtits"',
            error.message
        );
      })
      .then(done, done);
  }


  function shouldRejectIfTheConfigFileIsADirectory(done) {
    var instanceToTest = new patternlabToNode({
      "patternConfigFile": "../test/",
      "screenSizes": {},
      "excludePatterns": [
        'exclude'
      ]
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        __dirname + '/dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        throw new Error('should not resolve');
      }, (error) => {
        assert.equal(
            'PatternlabToNode - config error - could not find config file ' +
            '"../test/"',
            error.message
        );
      })
      .then(done, done);
  }


  function shouldReadThePatterconfigRelativeToTheConfigFile(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/minimalConfig.json'),
      "patternConfig.json": {
        patterns: {}
      },
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode(
        'config.json'
    );
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        assert.deepEqual({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              screenSizes: ['desktop']
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2",
              screenSizes: ['desktop']
            }
          }
        }, patternConfig);
      })
      .then(done, done);
  }


  function shouldRejectIfPatternsWhichAreInThePatternConfigAreMissingInTheStyleguide(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/missingPatterns.json'),
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode(
        'config.json'
    );
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        throw new Error('should not resolve');
      }, (error) => {
        assert.equal(
          'PatternlabToNode - config error - The following patterns are no longer part of the styleguide: "pattern-no-more"! Please check if they have been renamed or remove them from the config',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldRejectIfACustomScreenSizeWasFoundButNotDefined(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/missingPatternScreenSizes.json'),
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode(
        'config.json'
    );
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        throw new Error('should not resolve');
      }, (error) => {
        assert.equal(
          'PatternlabToNode - config error - ' +
              'The following screenSizes are used in patterns, but are not defined: ' +
              'unknownSize_1, unknownSize_2, ' +
              'unknownSize_3, unknownSize_4, ' +
              'unknownSize_5, unknownSize_6',
          error.message
        );
      })
      .then(done, done);
  }

  function shouldRejectIfAPatternHasBothSizeOverwritesAndAdditionsOrExcludes(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/patternWithModifiedAndOverwrittenScreenSizes.json'),
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode(
        'config.json'
    );
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        throw new Error('should not resolve');
      }, (error) => {
        assert.equal(
          'PatternlabToNode - config error - ' +
              'The following patterns have both overwrites and additionalScreenSizes or excludeScreenSizes defined: ' +
              'pattern-1, pattern-2' +
              ' please fix the configuration to use either overwrites or additionalScreenSizes/excludeScreenSizes',
          error.message
        );
      })
      .then(done, done);
  }

  function shouldLoadPatternsFromPatternConfigFile(done) {
    var randomInfo = 'data1-' + new Date().getTime();
    var randomInfo2 = 'data2-' + new Date().getTime();
    setUpFsMock({
      'config.json': {
        "screenSizes": {},
        "patternConfigFile": "patternConfigFile.json"
      },
      'patternConfigFile.json': {
        "patterns": {
          "pattern-1": {
            id: "pattern-1",
            name: "Pattern Name 1",
            data: randomInfo
          },
          "pattern-2": {
            id: "pattern-2",
            name: "Pattern Name 2",
            data: randomInfo2
          }
        }
      },
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    setUpPatternlabResponse(
      'http://localhost:3000',
      'dummyhtml/patterns.html'
    );
    var instanceToTest = new patternlabToNode('config.json');
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        assert.deepEqual({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              data: randomInfo,
              screenSizes: []
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2",
              data: randomInfo2,
              screenSizes: []
            }
          }
        }, patternConfig);
      })
      .then(done, done);
  }


  function shouldNotReturnPattersThatMatchOneOfTheExcludeRegexps(done) {
    setUpFsMock({
      'dummyhtml/patternsToExclude.html': __dirname + '/dummyhtml/patternsToExclude.html'
    });
    var instanceToTest = new patternlabToNode({
      "screenSizes": {},
      "excludePatterns": [
        'exclude'
      ]
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patternsToExclude.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        assert.deepEqual({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              screenSizes: []
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2",
              screenSizes: []
            }
          }
        }, patternConfig);
      })
      .then(done, done);
  }


  function shouldMergeOldAndNewPatterns(done) {
    var randomInfo = "some random info" + new Date().getTime();
    setUpFsMock({
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode({
      "screenSizes": {},
      "patterns": {
        "pattern-1": {
          id: "pattern-1", //TODO: remove
          name: "Pattern Name 1", //TODO: remove
          data: randomInfo
        }
      }
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        assert.deepEqual({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              data: randomInfo,
              screenSizes: []
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2",
              screenSizes: []
            }
          }
        }, patternConfig);
      })
      .then(done, done);
  }


  function shouldOverwriteScreenSizes(done) {
    setUpFsMock({
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode({
      "screenSizes": {
        'desktop': {
          width: 1024,
          height: 768
        },
        'tablet': {
          width: 768,
          height: 500
        }
      },
      "patterns": {
        "pattern-1" :{
          id: "pattern-1",
          name: "Pattern Name 1",
          screenSizes: ['desktop']
        },
        "pattern-2": {
          id: "pattern-2",
          name: "Pattern Name 2"
        }
      }
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        assert.deepEqual({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              screenSizes: ['desktop']
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2",
              screenSizes: ['desktop', 'tablet']
            }
          }
        }, patternConfig);
      })
      .then(done, done);
  }


  function shouldAddAdditionalScreenSizes(done) {
    setUpFsMock({
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode({
      "defaultSizes": ['desktop', 'tablet'],
      "screenSizes": {
        'desktop': {
          width: 1024,
          height: 768
        },
        'tablet': {
          width: 768,
          height: 500
        },
        'additionalSize': {
          width: 666,
          height: 999
        }
      },
      "patterns": {
        "pattern-1" :{
          id: "pattern-1",
          name: "Pattern Name 1"
        },
        "pattern-2": {
          id: "pattern-2",
          name: "Pattern Name 2",
          additionalScreenSizes: ['additionalSize']
        }
      }
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        assert.deepEqual(patternConfig, {
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              screenSizes: ['desktop', 'tablet']
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2",
              additionalScreenSizes: ['additionalSize'],
              screenSizes: ['desktop', 'tablet', 'additionalSize']
            }
          }
        });
      })
      .then(done, done);
  }


  function shouldRemoveScreenSizes(done) {
    setUpFsMock({
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode({
      "screenSizes": {
        'desktop': {
          width: 1024,
          height: 768
        },
        'tablet': {
          width: 768,
          height: 500
        }
      },
      "patterns": {
        "pattern-1" :{
          id: "pattern-1",
          name: "Pattern Name 1"
        },
        "pattern-2": {
          id: "pattern-2",
          name: "Pattern Name 2",
          excludeScreenSizes: ['tablet']
        }
      }
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        assert.deepEqual(patternConfig, {
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              screenSizes: ['desktop', 'tablet']
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2",
              excludeScreenSizes: ['tablet'],
              screenSizes: ['desktop']
            }
          }
        });
      })
      .then(done, done);
  }


  function shouldRejectIfAPatternExcludesAllScreenSizes(done) {
    setUpFsMock({
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode({
      "screenSizes": {
        'desktop': {
          width: 1024,
          height: 768
        },
        'tablet': {
          width: 768,
          height: 500
        }
      },
      "patterns": {
        "pattern-2": {
          id: "pattern-2", // TODO: remove
          name: "Pattern Name 2", // TODO: remove
          excludeScreenSizes: ['desktop', 'tablet']
        }
      }
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        throw new Error('should not have resolved');
      }, (error) => {
        assert.equal(
          'PatternlabToNode - config error - ' +
          'The following patterns have no screens: pattern-2',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldRejectIfAPatternOverwirtesWithEmptyScreenSizes(done) {
    setUpFsMock({
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode({
      "screenSizes": {
        'desktop': {
          width: 1024,
          height: 768
        },
        'tablet': {
          width: 768,
          height: 500
        }
      },
      "patterns": {
        "pattern-2": {
          id: "pattern-2", // TODO: remove
          name: "Pattern Name 2", // TODO: remove
          screenSizes: []
        }
      }
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        throw new Error('should not have resolved');
      }, (error) => {
        assert.equal(
          'PatternlabToNode - config error - ' +
          'The following patterns have no screens: pattern-2',
          error.message
        );
      })
      .then(done, done);
  }

  function shouldRejectIfTheRequestWasNotSuccessfull(done) {
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });

    // TODO: replace with public api call
    instanceToTest.getStyleguide_()
      .then(() => {
        throw new Error('should not have resolved');
      }, (error) => {
        // We just test if execptions from nock are properly bubbled up.
        // This would normally be an underlying layer exception.
        assert.equal(
            'Nock: Not allow net connect ' +
            'for "localhost:3000/styleguide/html/styleguide.html"',
            error.message
        );
      })
      .then(done, done);
  }


  function shouldTransformAllExcludeConfigsInRegexp(done) {
    var randomString = 'string' + new Date().getTime();
    var instanceToTest = new patternlabToNode({
      "screenSizes": {},
      "excludePatterns": [
        '^' + randomString,
        randomString + '$'
      ]
    });

    // TODO: replace with public api call
    instanceToTest.init_()
      .then(() => {
        assert.equal(
            '/^' + randomString + '/',
            instanceToTest.config_.excludePatterns[0]
        );
        assert.equal(
            '/' + randomString + '$/',
            instanceToTest.config_.excludePatterns[1]
        );
      })
      .then(done, done);
  }


  function shouldRejectIfTheStyleguidCouldNotBeFound(done) {
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });
    nock('http://localhost:3000')
      .get('/styleguide/html/styleguide.html')
      .reply(404, 'Not found', {'content-type': 'text/html'});

    // TODO: replace with public api call
    instanceToTest.getStyleguide_()
      .then(() => {
        throw new Error('should not have resolved');
      }, (error) => {
          // We just test if execptions from nock are properly bubbled up.
          // This would normally be an underlying layer exception.
        assert.equal(
              'PatternlabToNode - scraping error - ' +
              '"http://localhost:3000/styleguide/html/styleguide.html" could not be found',
              error.message
          );
      })
      .then(done, done);
  }


  function shouldRejectForAllUnkownStatusCodes(done) {
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });
    nock('http://localhost:3000')
      .get('/styleguide/html/styleguide.html')
      .reply(999);

    // TODO: replace with public api call
    instanceToTest.getStyleguide_()
      .then(() => {
        throw new Error('should not have resolved');
      }, (error) => {
          // We just test if execptions from nock are properly bubbled up.
          // This would normally be an underlying layer exception.
        assert.equal(
              'PatternlabToNode - scraping error - ' +
              'unknown error (statusCode was: 999)',
              error.message
          );
      })
      .then(done, done);
  }


  function shouldResolveWithTheBodyOfTheResponse(done) {
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });
    var randomBody = 'bodyContent' + new Date().getTime();
    nock('http://localhost:3000')
      .get('/styleguide/html/styleguide.html')
      .reply(200, randomBody);

    // TODO: replace with public api call
    instanceToTest.getStyleguide_()
      .then((bodyHtml) => {
        assert.equal(
              randomBody,
              bodyHtml
          );
      })
      .then(done, done);
  }


  function shouldRejectIfThereWereNoPatternInTheGivenHTML(done) {
    var dummyHtml = fs.readFileSync(
            path.resolve(__dirname, 'dummyhtml/noPatters.html')
        ).toString();
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });

    // TODO: replace with public api call
    instanceToTest.scrapePatternlab_(dummyHtml)
      .then(() => {
        throw new Error('should not have resolved');
      }, (error) => {
        assert.equal(
              'PatternlabToNode - scraping error - no pattern found',
              error.message
          );
      })
      .then(done, done);
  }


  function shouldRejectIfThereIsAPatternWithoutAnId(done) {
    var dummyHtml = fs.readFileSync(
            path.resolve(__dirname, 'dummyhtml/noPatternId.html')
        ).toString();
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });

    // TODO: replace with public api call
    instanceToTest.scrapePatternlab_(dummyHtml)
      .then(() => {
        throw new Error('should not have resolved');
      }, (error) => {
        assert.equal(
              'PatternlabToNode - scraping error - pattern without an id found',
              error.message
          );
      })
      .then(done, done);
  }


  function shouldReturnAllPatternWithinTheHTML(done) {
    var dummyHtml = fs.readFileSync(
            path.resolve(__dirname, 'dummyhtml/patterns.html')
        ).toString();
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });

    // TODO: replace with public api call
    instanceToTest.scrapePatternlab_(dummyHtml)
      .then((patterns) => {
        assert.deepEqual([
          {
            id: "pattern-1",
            name: "Pattern Name 1"
          },
          {
            id: "pattern-2",
            name: "Pattern Name 2"
          }
        ], patterns)
      })
      .then(done, done);
  }

  function defaultPatternlabUrlShouldPointToLocalhostOnPort3000() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.patternlabUrl;
    var instanceToTest = new patternlabToNode(config);
    assert.equal('http://localhost:3000', instanceToTest.config_.patternlabUrl);
  }

  function defaultoutputFileShouldPointToFile() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.outputFile;
    var instanceToTest = new patternlabToNode(config);
    assert.equal('./patternlabTests.js', instanceToTest.config_.outputFile);
  }

  function defaultTemplateFileShouldPointToFile() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.templateFile;
    var instanceToTest = new patternlabToNode(config);
    assert.equal(path.resolve(__dirname, '../templates/main.ejs'), instanceToTest.config_.templateFile);
  }

  function shouldExcludeNoPatternByDefault() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.excludePatterns;
    var instanceToTest = new patternlabToNode(config);
    assert.equal(0, instanceToTest.config_.excludePatterns.length);
  }

  function shouldOverwriteTheConfigurationWithAGivenConfigObject() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    var instanceToTest = new patternlabToNode(config);
    assert.deepEqual(instanceToTest.config_, config);
  }

  function shouldOverwriteTheConfigurationWithAGivenFilename() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    var instanceToTest = new patternlabToNode(__dirname + '/../example.config.json');
    assert.deepEqual(instanceToTest.config_, config);
  }

  function shouldFailIfThereAreNoScreenSizesDefined() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.screenSizes;
    assert.throws(() => {
      /* eslint-disable no-new */
      new patternlabToNode(config);

      /* eslint-enable no-new */
    }, null, /missing screenSizes/);
  }

  function shouldFailIfPatternsAndPatternConfigFileAreDefined() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    config.patterns = {};
    assert.throws(() => {
      /* eslint-disable no-new */
      new patternlabToNode(config);

      /* eslint-enable no-new */
    }, null, /Please use either the patternConfigFile or the patterns settings/);
  }

  function shouldFailIfAScreenSizeWasReferencedWhichIsNotDefined() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    config.defaultSizes = ['notExistingScreenSize_1', 'unknownScreenSize_2'];
    assert.throws(() => {
      /* eslint-disable no-new */
      new patternlabToNode(config);

      /* eslint-enable no-new */
    }, null, /The following default screenSizes are not defined: notExistingScreenSize_1, unknownScreenSize_2/);
  }

  /* ------------------------------------------------------------------
   * Helpers
   * --------------------------------------------------------------- */

  /**
   * @param {string} domain
   *    the domain including protocol & port
   * @param responseBodyFileName
   *    the path to the file which will be the body of the response
   */
  function setUpPatternlabResponse(domain, responseBodyFileName) {
    nock(domain)
      .get('/styleguide/html/styleguide.html')
      .replyWithFile(200, responseBodyFileName);
  }

  /**
   * @param {Object<string, string>} options
   */
  function setUpFsMock(options) {
    for (var key in options) {
      if (typeof options[key] === 'string') {
        options[key] = fs.readFileSync(options[key]).toString();
      } else {
        options[key] = JSON.stringify(options[key]);
      }
    }
    mock_fs(options);
  }
});