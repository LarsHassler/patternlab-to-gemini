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
var nodeDebug = require('debug');
var packageJson = require('../package.json');
var p2g;

/**
 * @param {Array.<string>} args
 *    should be process.argv
 * @return {Promise.<>}
 */
function start(args) {
  program
    .version(packageJson.version)
    .option('-c, --config <filename>', 'your patternlab-tog-gemini config file')
    .option('-d, --debug', 'enable debug output')
    .parse(args);

  if (program.debug) {
    nodeDebug.enable('patternlab-to-gemini:*');
  }
  if (!program.config) {
    throw Error('please provide a config file via the --config (-c) flag');
  }
  else {
    const debug = nodeDebug('patternlab-to-gemini:cli');

    const configFile = path.resolve(process.cwd(), program.config);

    debug('starting with ' + configFile);

    p2g = p2g || /* istanbul ignore next: we need this construct to be able to test everything properly */ require('./main.js');
    const patternlabToGemini = new p2g(configFile);
    return patternlabToGemini.generateTests()
      .then(() => {
        if (patternlabToGemini.getWarnings().length) {
          process.stdout.write(
            patternlabToGemini.getWarnings().join('\n') +
            '\n\n'
          );
        }
        debug('done');
        process.stdout.write('done\n');
      }, (err) => {
        debug(err);
        process.stderr.write(err.message + '\n');
      });
  }
}

module.exports = start;
