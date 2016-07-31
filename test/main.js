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

const patternlabToNode = require('../src/main');
const path = require('path');
const fs = require('fs');
const assert = require('chai').assert;
const exampleConfig = require('../example.config.json');


describe('main - ', () => {

  describe('config - ', () => {

    it('default pattern lab url should point to local host on port 3000',
        defaultPatternlabUrlShouldPointToLocalhostOnPort3000
    );

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
  
  describe('scrapePatternlab_ - ', function() {
    
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


  function shouldRejectIfThereWereNoPatternInTheGivenHTML(done) {
    var dummyHtml = fs.readFileSync(
            path.resolve(__dirname, 'dummyhtml/noPatters.html')
        ).toString();
    var instanceToTest = new patternlabToNode({
      "screenSizes": {}
    });
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
    delete config['patternlabUrl'];
    var instanceToTest = new patternlabToNode(config);
    assert.equal('http://localhost:3000', instanceToTest.config_['patternlabUrl']);
  }

  function shouldExcludeNoPatternByDefault() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config['excludePatterns'];
    var instanceToTest = new patternlabToNode(config);
    assert.equal(0, instanceToTest.config_['excludePatterns'].length);
  }

  function shouldOverwriteTheConfigurationWithAGivenConfigObject() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    var instanceToTest = new patternlabToNode(config);
    assert.deepEqual(instanceToTest.config_, config);
  }

  function shouldOverwriteTheConfigurationWithAGivenFilename() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    var instanceToTest = new patternlabToNode('../example.config.json');
    assert.deepEqual(instanceToTest.config_, config);
  }

  function shouldFailIfThereAreNoScreenSizesDefined() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config['screenSizes'];
    assert.throws(() => {
      new patternlabToNode(config);
    }, null, /missing screenSizes/);
  }
});