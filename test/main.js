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

const asserts = require('@remobid/js-lib-asserts');
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

    it('should show a deprecation warning if the patternfile has been defined',
      shouldShowADeprecationWarningIfThePatternfileHasBeenDefined
    );

    it('should load patterns from pattern config file',
      shouldLoadPatternsFromPatternConfigFile
    );

    it('should not return patters that match one of the exclude regexps',
        shouldNotReturnPattersThatMatchOneOfTheExcludeRegexps
    );

    it('should not return patterns that match one of the state regexps',
        shouldNotReturnPatternsThatMatchOneOfTheStateRegexps
    );

    it('should reject if patterns which are in the patternConfig are missing in the styleguide',
      shouldRejectIfPatternsWhichAreInThePatternConfigAreMissingInTheStyleguide
    );

    it('should merge old and new patterns',
        shouldMergeOldAndNewPatterns
    );

    describe('pattern screen options - ', function() {
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

    describe('skipBrowsers - ', function() {

      it('should reject if its not an array',
        shouldRejectIfItsNotAnArray
      );

      it('should reject if the array element is neither a string nor a browser object',
        shouldRejectIfTheArrayElementIsNeitherAStringNorABrowserObject
      );

      it('should work with strings',
        shouldWorkWithStrings
      );

      it('should work with object definitions',
        shouldWorkWithObjectDefinitions
      );
    });

    describe('actions - ', function() {

      it('should fail if no action was given',
        shouldFailIfNoActionWasGiven
      );

      it('should fail for unknown actions',
        shouldFailForUnknownActions
      );

      it('should fail if no name was given',
        shouldFailIfNoNameWasGiven
      );

      it('should set the default selector for actions',
        shouldSetTheDefaultSelectorForActions
      );

      it('should not overwrite a given selector',
        shouldNotOverwriteAGivenSelector
      );

      it('should add correct steps for focus',
        shouldAddCorrectStepsForFocus
      );

      describe('skipBrowsers - ', function() {

        it('should reject if its not an array',
          action_shouldRejectIfItsNotAnArray
        );

        it('should reject if the array element is neither a string nor a browser object',
          action_shouldRejectIfTheArrayElementIsNeitherAStringNorABrowserObject
        );

        it('should work with strings',
          action_shouldWorkWithStrings
        );

        it('should work with object definitions',
          action_shouldWorkWithObjectDefinitions
        );
      });

      describe('hover - ', function() {

        it('should add the correct steps for hover if pseudo class is set',
          shouldAddTheCorrectStepsForHoverIfPseudoClassIsSet
        );
        it('should add the correct steps for hover if pseudo class and selector are set',
          shouldAddTheCorrectStepsForHoverIfPseudoClassAndSelectorAreSet
        );

        it('should add correct steps for hover',
          shouldAddCorrectStepsForHover
        );

      });

      describe('sendKeys - ', function() {

        it('should fail if keys are missing',
          shouldFailIfKeysAreMissing
        );

        it('should add correct steps for send keys',
          shouldAddCorrectStepsForSendKeys
        );
      });
    });

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

    it('should work with multiple actions',
      shouldWorkWithMultipleActions
    );

    it('should work with action with selectors',
      shouldWorkWithActionWithSelectors
    );

    it('should work with skipping multiple browsers',
      shouldWorkWithSkippingMultipleBrowsers
    );

    it('should work with skipping browsers for actions',
      shouldWorkWithSkippingBrowsersForActions
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - rendering error - ' +
              'there was an error while rendering "' +
              path.resolve('noExistingTemplateFile') + '"',
          error.message);
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
        asserts.assertEquals(
          "wrong testFile generated",
          fs.readFileSync('expectedTest.js').toString(),
          fs.readFileSync('patternlabTests.js').toString()
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
        asserts.assertEquals(
          "wrong testFile generated",
          fs.readFileSync('expectedTest.js').toString(),
          fs.readFileSync('patternlabTests.js').toString()
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
        asserts.assertEquals(
          "wrong testFile generated",
          fs.readFileSync('expectedTest.js').toString(),
          fs.readFileSync('patternlabTests.js').toString()
        )
      })
      .then(done, done);
  }

  function shouldWorkWithMultipleActions(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/definedMultiplePatternActions.json'),
      "expectedTest.js": path.resolve(__dirname, 'expectedTestFiles/generateTestsMultiplePatternActions.js'),
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
              "screenSizes": ["desktop"],
              "actions": [
                {
                  "action": "hover",
                  "name": "hovered",
                  "selector": "> *",
                  "steps": ".moveMouse(this.element)"
                },
                {
                  "action": "focus",
                  "name": "focused",
                  "selector": "> *",
                  "steps": ".focus(this.element)"
                },
                {
                  "action": "sendKeys",
                  "name": "sendKeys",
                  "selector": "> *",
                  "steps": ".sendKeys(this.element, 'inputString')"
                }
              ]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        asserts.assertEquals(
          "wrong testFile generated",
          fs.readFileSync('expectedTest.js').toString(),
          fs.readFileSync('patternlabTests.js').toString()
        )
      })
      .then(done, done);
  }


  function shouldWorkWithActionWithSelectors(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/definedPatternActionsWithSelector.json'),
      "expectedTest.js": path.resolve(__dirname, 'expectedTestFiles/generateTestsPatternActionsWithSelector.js'),
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
              "screenSizes": ["desktop"],
              "actions": [
                {
                  "action": "hover",
                  "name": "hovered",
                  "selector": "button",
                  "steps": ".moveMouse(this.element)"
                }
              ]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        asserts.assertEquals(
          "wrong testFile generated",
          fs.readFileSync('expectedTest.js').toString(),
          fs.readFileSync('patternlabTests.js').toString()
        )
      })
      .then(done, done);
  }


  function shouldWorkWithSkippingMultipleBrowsers(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/skipBrowsers.json'),
      "expectedTest.js": path.resolve(__dirname, 'expectedTestFiles/generatedTestsSkipBrowsers.js'),
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
              "screenSizes": ["desktop"],
              "skipBrowsers": [
                {
                  "regexp": "chrome",
                  "comment": "skipped via patternlab-to-gemini config"
                },
                {
                  "regexp": "ie",
                  "comment": "custom comment"
                }
              ]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        asserts.assertEquals(
          "wrong testFile generated",
          fs.readFileSync('expectedTest.js').toString(),
          fs.readFileSync('patternlabTests.js').toString()
        )
      })
      .then(done, done);
  }


  function shouldWorkWithSkippingBrowsersForActions(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/skipBrowsersForAction.json'),
      "expectedTest.js": path.resolve(__dirname, 'expectedTestFiles/generatedTestsSkipBrowsersForAction.js'),
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
              "screenSizes": ["desktop"],
              "actions": [
                {
                  "action": "hover",
                  "name": "hovered",
                  "selector": "button",
                  "steps": ".moveMouse(this.element)",
                  "skipBrowsers": [
                    {
                      "regexp": "chrome",
                      "comment": "skipped via patternlab-to-gemini config"
                    },
                    {
                      "regexp": "ie",
                      "comment": "custom comment"
                    }
                  ]
                }
              ]
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2",
              "screenSizes": ["desktop"]
            }
          }
        });
      })
    };
    instanceToTest.generateTests()
      .then(() => {
        asserts.assertEquals(
          "wrong testFile generated",
          fs.readFileSync('expectedTest.js').toString(),
          fs.readFileSync('patternlabTests.js').toString()
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
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
          },
          patternConfig
        );
      })
      .then(done, done);
  }


  function shouldShowADeprecationWarningIfThePatternfileHasBeenDefined(done) {
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
      .then(() => {
        asserts.assertArrayEquals(
          'wrong warnings set',
          [
            'Deprecating Warning: patternConfigFile is deprecated. ' +
            'It will be removed in 1.0.0. Please use "patterns" instead.'
          ],
          instanceToTest.getWarnings()
        );
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - ' +
              'The following patterns are no longer part of the styleguide: ' +
              '"pattern-no-more"! ' +
              'Please check if they have been renamed or' +
              ' remove them from the config',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldFailIfNoActionWasGiven(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/missingActionIdentifier.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 is missing action identifier',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldRejectIfItsNotAnArray(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/skipBrowsersNotAnArray.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 skipBrowsers is not an array',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldRejectIfTheArrayElementIsNeitherAStringNorABrowserObject(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/skipBrowsersElementInvalid.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 skipBrowsers entry 2 is not valid',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldWorkWithStrings(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/skipBrowsersStrings.json'),
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
        asserts.assertArrayEquals(
          'wrong skipBrowsers returned',
          [
            {
              regexp: "chrome",
              comment: "skipped via patternlab-to-gemini config"
            },
            {
              regexp: "ff",
              comment: "skipped via patternlab-to-gemini config"
            },
          ],
          patternConfig.patterns["pattern-1"].skipBrowsers
        )
      })
      .then(done, done);
  }


  function shouldWorkWithObjectDefinitions(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/skipBrowsersObjects.json'),
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
        asserts.assertArrayEquals(
          'wrong skipBrowsers returned',
          [
            {
              "regexp": "chrome",
              "comment": "chrome disabled"
            },
            {
              "regexp": "ff",
              comment: "skipped via patternlab-to-gemini config"
            }
          ],
          patternConfig.patterns["pattern-1"].skipBrowsers
        )
      })
      .then(done, done);
  }


  function action_shouldRejectIfItsNotAnArray(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionSkipBrowsersNotAnArray.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 action "hover" skipBrowsers is not an array',
          error.message
        );
      })
      .then(done, done);
  }


  function action_shouldRejectIfTheArrayElementIsNeitherAStringNorABrowserObject(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionSkipBrowsersElementInvalid.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 action "hover" skipBrowsers entry 2 is not valid',
          error.message
        );
      })
      .then(done, done);
  }


  function action_shouldWorkWithStrings(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionSkipBrowsersStrings.json'),
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
        asserts.assertArrayEquals(
          'wrong skipBrowsers returned',
          [
            {
              regexp: "chrome",
              comment: "skipped via patternlab-to-gemini config"
            },
            {
              regexp: "ff",
              comment: "skipped via patternlab-to-gemini config"
            },
          ],
          patternConfig.patterns["pattern-1"].actions[0].skipBrowsers
        )
      })
      .then(done, done);
  }


  function action_shouldWorkWithObjectDefinitions(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionSkipBrowsersObjects.json'),
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
        asserts.assertArrayEquals(
          'wrong skipBrowsers returned',
          [
            {
              "regexp": "chrome",
              "comment": "chrome disabled"
            },
            {
              "regexp": "ff",
              comment: "skipped via patternlab-to-gemini config"
            }
          ],
          patternConfig.patterns["pattern-1"].actions[0].skipBrowsers
        )
      })
      .then(done, done);
  }


  function shouldFailForUnknownActions(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/unkownActionIdentifier.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 has unknown action identifier "unknownAction", use ("hover", "focus", "sendKeys")',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldFailIfKeysAreMissing(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/missingKeysOptionForSendKeys.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 is missing "keys" option required for sendKeys',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldFailIfNoNameWasGiven(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/missingActionName.json'),
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
        asserts.assertEquals(
          'wrong error message',
          'PatternlabToNode - config error - pattern-1 is missing action name',
          error.message
        );
      })
      .then(done, done);
  }


  function shouldSetTheDefaultSelectorForActions(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionWithoutSelector.json'),
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
        asserts.assertEquals(
          'wrong selector for action',
          '> *',
          patternConfig.patterns['pattern-1'].actions[0].selector
        );
      })
      .then(done, done);
  }


  function shouldNotOverwriteAGivenSelector(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionWithSelector.json'),
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
        asserts.assertEquals(
          'wrong selector for action',
          'myDummSelector',
          patternConfig.patterns['pattern-1'].actions[0].selector
        );
      })
      .then(done, done);
  }


  function shouldAddCorrectStepsForHover(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionHover.json'),
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
        asserts.assertEquals(
          'wrong steps for action',
          '.mouseMove(this.element)',
          patternConfig.patterns['pattern-1'].actions[0].steps
        );
      })
      .then(done, done);
  }


  function shouldAddTheCorrectStepsForHoverIfPseudoClassIsSet(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionHoverWithPseudoClass.json'),
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
        asserts.assertEquals(
          'wrong steps for action',
          '.executeJS(function() {\n' +
          '  window.document.querySelector(\'#pattern-1 .sg-pattern-example > *\').classList.add(\':hover\')\n' +
          '})',
          patternConfig.patterns['pattern-1'].actions[0].steps
        );
      })
      .then(done, done);
  }


  function shouldAddTheCorrectStepsForHoverIfPseudoClassAndSelectorAreSet(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionHoverWithPseudoClassWithSelector.json'),
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
        asserts.assertEquals(
          'wrong steps for action',
          '.executeJS(function() {\n' +
          '  window.document.querySelector(\'#pattern-1 .sg-pattern-example .custom-selector\').classList.add(\':hover\')\n' +
          '})',
          patternConfig.patterns['pattern-1'].actions[0].steps
        );
      })
      .then(done, done);
  }


  function shouldAddCorrectStepsForSendKeys(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionSendKeys.json'),
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
        asserts.assertEquals(
          'wrong steps for action',
          '.sendKeys(this.element, \'dummyString\')',
          patternConfig.patterns['pattern-1'].actions[0].steps
        );
      })
      .then(done, done);
  }


  function shouldAddCorrectStepsForFocus(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/actionFocus.json'),
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
        asserts.assertEquals(
          'wrong steps for action',
          '.focus(this.element)',
          patternConfig.patterns['pattern-1'].actions[0].steps
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong error message',
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
            data: randomInfo
          },
          "pattern-2": {
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
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
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
          },
          patternConfig
        );
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
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
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
          },
          patternConfig
        );
      })
      .then(done, done);
  }


  function shouldNotReturnPatternsThatMatchOneOfTheStateRegexps(done) {
    setUpFsMock({
      'dummyhtml/statesToExclude.html': __dirname + '/dummyhtml/statesToExclude.html'
    });
    var instanceToTest = new patternlabToNode({
      "screenSizes": {},
      "excludeStates": [
        "inprogress",
        "idea"
      ]
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/statesToExclude.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then((patternConfig) => {
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
            "_patternOrder": [
              "pattern-3",
              "pattern-4",
            ],
            "patterns": {
              "pattern-3": {
                id: "pattern-3",
                name: "Pattern Name 3",
                screenSizes: []
              },
              "pattern-4": {
                id: "pattern-4",
                name: "Pattern Name 4",
                screenSizes: []
              }
            }
          },
          patternConfig
        );
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
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
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
          },
          patternConfig
        );
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
          screenSizes: ['desktop']
        },
        "pattern-2": {
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
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
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
          },
          patternConfig
        );
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
        },
        "pattern-2": {
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
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
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
          },
          patternConfig
        );
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
        },
        "pattern-2": {
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
        asserts.assertObjectEquals(
          'wrong pattern config',
          {
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
          },
          patternConfig
        );
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong regexp for pattern 1',
          '/^' + randomString + '/',
          instanceToTest.config_.excludePatterns[0].toString()
        );
        asserts.assertEquals(
          'wrong regexp for pattern 2',
          '/' + randomString + '$/',
          instanceToTest.config_.excludePatterns[1].toString()
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong html returned',
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertEquals(
          'wrong error message',
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
        asserts.assertArrayEquals(
          'wrong patterns returned',
          [
            {
              id: "pattern-1",
              name: "Pattern Name 1"
            },
            {
              id: "pattern-2",
              name: "Pattern Name 2"
            }
          ],
          patterns
      )
      })
      .then(done, done);
  }

  function defaultPatternlabUrlShouldPointToLocalhostOnPort3000() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.patternlabUrl;
    var instanceToTest = new patternlabToNode(config);
    asserts.assertEquals(
      'wrong patternlabUrl',
      'http://localhost:3000',
      instanceToTest.config_.patternlabUrl
    );
  }

  function defaultoutputFileShouldPointToFile() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.outputFile;
    var instanceToTest = new patternlabToNode(config);
    asserts.assertEquals(
      'wrong outputfile',
      './patternlabTests.js',
      instanceToTest.config_.outputFile
    );
  }

  function defaultTemplateFileShouldPointToFile() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.templateFile;
    var instanceToTest = new patternlabToNode(config);
    asserts.assertEquals(
      'wrong templateFile',
      path.resolve(__dirname, '../templates/main.ejs'),
      instanceToTest.config_.templateFile
    );
  }

  function shouldExcludeNoPatternByDefault() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.excludePatterns;
    var instanceToTest = new patternlabToNode(config);
    asserts.assertEquals(
      'wrong number of excluded patterns',
      0,
      instanceToTest.config_.excludePatterns.length
    );
  }

  function shouldOverwriteTheConfigurationWithAGivenConfigObject() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    var instanceToTest = new patternlabToNode(config);
    asserts.assertObjectEquals(
      'wrong config set',
      instanceToTest.config_,
      config
    );
  }

  function shouldOverwriteTheConfigurationWithAGivenFilename() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    var instanceToTest = new patternlabToNode(__dirname + '/../example.config.json');
    asserts.assertObjectEquals(
      'wrong config set',
      instanceToTest.config_,
      config
    );
  }

  function shouldFailIfThereAreNoScreenSizesDefined() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config.screenSizes;
    const error = asserts.assertThrows(() => {
      /* eslint-disable no-new */
      new patternlabToNode(config);

      /* eslint-enable no-new */
    });
    asserts.assertEquals(
      'wrong error message',
      'PatternlabToNode - config error - missing screenSizes',
      error.message
    );
  }

  function shouldFailIfPatternsAndPatternConfigFileAreDefined() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    config.patterns = {};
    const error = asserts.assertThrows(() => {
      /* eslint-disable no-new */
      new patternlabToNode(config);

      /* eslint-enable no-new */
    });
    asserts.assertEquals(
      'wrong error message',
      'PatternlabToNode - config error - Please use either the patternConfigFile or the patterns settings',
      error.message
    );
  }

  function shouldFailIfAScreenSizeWasReferencedWhichIsNotDefined() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    config.defaultSizes = ['notExistingScreenSize_1', 'unknownScreenSize_2'];
    const error = asserts.assertThrows(() => {
      /* eslint-disable no-new */
      new patternlabToNode(config);

      /* eslint-enable no-new */
    });


    asserts.assertEquals(
      'wrong error message',
      'PatternlabToNode - config error - The following default screenSizes are not defined: notExistingScreenSize_1, unknownScreenSize_2',
      error.message
    );
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
