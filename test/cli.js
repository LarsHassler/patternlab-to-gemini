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
const rewire = require('rewire');
const debug = require('debug')('patternlab-to-gemini:_test:cli');

const testStdErr = require('test-console').stderr;
const testStdOut = require('test-console').stdout;

const patternlabToNodeCli = rewire('../src/cli');


describe('cli - ', () => {

  const rewiresToRevert = [];
  var stderrMock;
  var stdoutMock;

  /* ------------------------------------------------------------------
   * Setup & Tear down
   * --------------------------------------------------------------- */

  before(() => {

  });

  beforeEach(() => {
    stderrMock = testStdErr.inspect();
    stdoutMock = testStdOut.inspect();
  });

  afterEach(() => {
    rewiresToRevert.forEach((revertFunction) => {
      revertFunction();
    });
    if (stderrMock) {
      debug('stderrMock:');
      debug(stderrMock.output);
    }
    if (stdoutMock) {
      debug('stdoutMock:');
      debug(stdoutMock.output);
    }
  });

  after(() => {

  });



  /* ------------------------------------------------------------------
   * Test cases
   * --------------------------------------------------------------- */

  describe('start - ', function() {

    it('should throw an error if no configFile was provided',
        shouldThrowAnErrorIfNoConfigFileWasProvided
    );

    it('should resolve --config flag to current pwd',
        shouldResolveConfigFlagToCurrentPwd
    );

    it('should resolve -c flag to current pwd',
        shouldResolveCFlagToCurrentPwd
    );

    it('should print all errors to stderr',
      shouldPrintAllErrorsToStderr
    );

  });




  /* ------------------------------------------------------------------
   * Test case implementation
   * --------------------------------------------------------------- */

  function shouldThrowAnErrorIfNoConfigFileWasProvided(done) {
    assert.throws(
        function() {
          patternlabToNodeCli(["node", "/bin/patternlab-to-gemini"])
        },
        'please provide a config file via the --config (-c) flag'
    );
    resetConsole();
    done();
  }

  function shouldResolveConfigFlagToCurrentPwd(done) {
    var randomFilename = 'filename' + new Date().getTime();
    var rewired = patternlabToNodeCli.__set__({
      p2g: function(configfile) {
        assert.equal(configfile, process.cwd() + '/' + randomFilename, 'wrong configfile set');
        return {
          generateTests: function() {
            return new Promise((resolve) => { resolve(); });
          }
        }
      }
    });
    rewiresToRevert.push(rewired);

    patternlabToNodeCli(["node", "/bin/patternlab-to-gemini", '--config', randomFilename])
      .then(() => {
        resetConsole();
      }, (err) => {
        resetConsole();
        throw err;
      })
      .then(done, done);
  }

  function shouldResolveCFlagToCurrentPwd(done) {
    var randomFilename = 'filename' + new Date().getTime();
    var rewired = patternlabToNodeCli.__set__({
      p2g: function(configfile) {
        assert.equal(configfile, process.cwd() + '/' + randomFilename, 'wrong configfile set');
        return {
          generateTests: function() {
            return new Promise((resolve) => { resolve(); });
          }
        }
      }
    });
    rewiresToRevert.push(rewired);

    patternlabToNodeCli(["node", "/bin/patternlab-to-gemini", '-c', randomFilename])
      .then(() => {
        resetConsole();
      }, (err) => {
        resetConsole();
        throw err;
      })
      .then(done, done);
  }

  function shouldPrintAllErrorsToStderr(done) {
    var randomPwd = '/path/to/dir/' + new Date().getTime();
    var randomErrorMessage = 'errormessage' + new Date().getTime();
    var randomFilename = 'filename' + new Date().getTime();
    var rewired = patternlabToNodeCli.__set__({
      p2g: function(configfile) {
        return {
          generateTests: function() {
            return new Promise((resolve, reject) => {
              var err = new Error(randomErrorMessage);
              reject(err);
            });
          }
        }
      }
    });
    rewiresToRevert.push(rewired);

    patternlabToNodeCli(["node", "/bin/patternlab-to-gemini", '-c', randomFilename])
      .then(() => {
        assert.equal(
          randomErrorMessage,
          stderrMock.output
        );
      })
      .then(() => {
        resetConsole();
        done();
      }, (err) => {
        resetConsole();
        done(err);
      });
  }


  /* ------------------------------------------------------------------
   * Helpers
   * --------------------------------------------------------------- */

  function resetConsole() {
    if (stderrMock) {
      stderrMock.restore();
    }
    if (stdoutMock) {
      stdoutMock.restore();
    }
  }
});