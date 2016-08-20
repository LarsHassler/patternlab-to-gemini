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

    it('should overwrite the configuration with a given config object',
        shouldOverwriteTheConfigurationWithAGivenConfigObject
    );

    it('should overwrite the configuration with a given filename',
        shouldOverwriteTheConfigurationWithAGivenFilename
    );

    it('should fail if there are no screen sizes defined',
        shouldFailIfThereAreNoScreenSizesDefined
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

    it('should reject if the config file does not exist',
        shouldRejectIfTheConfigFileDoesNotExist
    );

    it('should reject if the config file is a directory',
        shouldRejectIfTheConfigFileIsADirectory
    );

    it('should read the patterconfig relative to the config file',
        shouldReadThePatterconfigRelativeToTheConfigFile
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

  });

  describe('generateTests - ', function() {

    it('should reject if there was an error while rendering the template',
        shouldRejectIfThereWasAnErrorWhileRenderingTheTemplate
    );

    it('should generate the correct test file',
        shouldGenerateTheCorrectTestFile
    );

  });


  /* ------------------------------------------------------------------
   * Test case implementation
   * --------------------------------------------------------------- */

  function shouldRejectIfThereWasAnErrorWhileRenderingTheTemplate(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/config2.json')
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
              "name": "Pattern Name 1"
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2"
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
              "name": "Pattern Name 1"
            },
            "pattern-2": {
              "id": "pattern-2",
              "name": "Pattern Name 2"
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
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/config1.json'),
      "emptyConfig.json": {
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
              name: "Pattern Name 1"
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2"
            }
          }
        }, patternConfig);
      })
      .then(done, done);
  }


  function shouldRejectIfPatternsWhichAreInThePatternConfigAreMissingInTheStyleguide(done) {
    setUpFsMock({
      "config.json": path.resolve(__dirname, 'patternlab-to-geminiConfigs/config1.json'),
      "emptyConfig.json": {
        patterns: {
          "pattern-no-more": {
            id: "pattern-no-more",
            name: "Pattern which is no longer part of the styleguide"
          }
        }
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
        throw new Error('should not resolve');
      }, (error) => {
        assert.equal(
          'PatternlabToNode - config error - The following patterns are no longer part of the styleguide: "pattern-no-more"! Please check if they have been renamed or remove them from the config',
          error.message
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
        assert.deepEqual({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1"
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2"
            }
          }
        }, patternConfig);
      })
      .then(done, done);
  }


  function shouldMergeOldAndNewPatterns(done) {
    var randomInfo = "some random info" + new Date().getTime();
    setUpFsMock({
      "oldConfig.json": {
        "_patternOrder": [
          "pattern-1",
          "pattern-2"
        ],
        "patterns": {
          "pattern-1" :{
            id: "pattern-1",
            name: "Pattern Name 1",
            data: randomInfo
          },
          "pattern-2": {
            id: "pattern-2",
            name: "Pattern Name 2"
          }
        }
      },
      'dummyhtml/patterns.html': __dirname + '/dummyhtml/patterns.html'
    });
    var instanceToTest = new patternlabToNode({
      "patternConfigFile": "../oldConfig.json",
      "screenSizes": {}
    });
    setUpPatternlabResponse(
        'http://localhost:3000',
        'dummyhtml/patterns.html'
    );
    instanceToTest.getPatternsConfiguration()
      .then(() => {
        assert.deepEqual({
          "_patternOrder": [
            "pattern-1",
            "pattern-2"
          ],
          "patterns": {
            "pattern-1": {
              id: "pattern-1",
              name: "Pattern Name 1",
              data: randomInfo
            },
            "pattern-2": {
              id: "pattern-2",
              name: "Pattern Name 2"
            }
          }
        }, JSON.parse(fs.readFileSync('oldConfig.json').toString()));
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
    assert.equal('./templates/main.ejs', instanceToTest.config_.templateFile);
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