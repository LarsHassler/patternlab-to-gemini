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

const program = require('commander');
const path = require('path');
const debug = require('debug')('patternlabe-to-gemini:cli');
var p2g = require('./main.js');

/**
 * @return {Promise.<>}
 */
function start() {
  program
    .option('-c, --config <filename>', 'your patternlab-tog-gemini config file')
    .parse(process.argv);

  if (!program.config) {
    throw Error('please provide a config file via the --config (-c) flag');
  }
  else {
    const configFile = path.resolve(process.cwd(), program.config);

    debug('starting with ' + configFile);
    const patternlabToGemini = new p2g(configFile);
    return patternlabToGemini.generateTests()
      .then(() => {
        debug('done');

        // TODO add proper stdout output
      }, (err) => {
        debug(err);

        // TODO add proper stderr output
      });
  }
}

module.exports = start;
