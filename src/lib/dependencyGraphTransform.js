/*
 * Copyright (c) 2017 Lars Haßler <mail@LarsHassler.com>
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

/**
 * @param {string} pathToPattern
 * @return {boolean}
 *    whenever the pattern should be excluded
 */
function shouldPatternBeExcluded(pathToPattern) {
  return pathToPattern.indexOf("~") !== -1 ||
    pathToPattern.match(/_[0-9]*-foot/) ||
    pathToPattern.match(/_[0-9]*-head/) ||
    pathToPattern.match(/\.json$/)
}

/**
 * @param {string} pathToPattern
 * @return {string}
 */
function generatePatternNameFromPath(pathToPattern) {
  var patternPathParts = pathToPattern.match(/^([^/]*)\/.*\/([^.]*)\.[^.]*$/);
  return patternPathParts[1] + "-" + patternPathParts[2]
}

/**
 * @param {{
 *    version: number,
 *    timestamp: number,
 *    graph: {
 *      options: {
 *          directed: boolean,
 *          multigraph: boolean,
 *          compound: boolean
 *      },
 *      nodes: Array.<{
 *        v: string,
 *        value: {
 *          compileState: string,
 *          lineagePath: string,
 *          lineagePattern: string,
 *        }
 *      }>,
 *      edges: Array.<{
 *        v: string,
 *        w: string,
 *        value: Object
 *      }>
 *    }
 * }} dependencyGraph
 * @return {Object.<string, {
 *    failed: boolean,
 *    dependentOn: Array.<string>
 * }>}
 */
module.exports = function(dependencyGraph) {
  var transformedTree = {};

  dependencyGraph.graph.nodes.forEach(function(node) {
    var pathToPattern = node.v;

    if (shouldPatternBeExcluded(pathToPattern)) {
      return
    }

    var name = generatePatternNameFromPath(pathToPattern);

    transformedTree[name] = {
      failed: false,
      dependentOn: []
    }
  });

  dependencyGraph.graph.edges.forEach(function(edge) {
    if (shouldPatternBeExcluded(edge.v)) {
      return
    }

    var name = generatePatternNameFromPath(edge.v);
    var dependentOnName = generatePatternNameFromPath(edge.w);

    transformedTree[name].dependentOn.push(dependentOnName);
  });

  return transformedTree
};
