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

var patternlabToNode = require('../src/main');
var assert = require('chai').assert;
var exampleConfig = require('../example.config.json');


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

  });



  function defaultPatternlabUrlShouldPointToLocalhostOnPort3000() {
    var config = JSON.parse(JSON.stringify(exampleConfig));
    delete config['patternlabUrl'];
    var instanceToTest = new patternlabToNode(config);
    assert.equal('http://localhost:3000', instanceToTest.config_['patternlabUrl']);
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