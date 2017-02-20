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


const dependencyGraphTransform = require(
  '../../src/lib/dependencyGraphTransform.js');


describe('dependencyGraphTransform - ', () => {

  it('should transform path to nodes into names',
    shouldTransformPathToNodesIntoNames
  );


  describe('skip nodes - ', function() {

    it('should skip json nodes',
      shouldSkipJsonNodes
    );

    it('should skip patternlab meta',
      shouldSkipPatternlabMeta
    );

    it('should skip pattern states',
      shouldSkipPatternStates
    );

  });

  describe('edges - ', function() {

    it('should add edges to dependentOn array',
      shouldAddEdgesToDependentOnArray
    );

    describe('skip edges - ', function() {

      it('should skip json edges',
        shouldSkipJsonEdges
      );

    });

  });

  function shouldAddEdgesToDependentOnArray() {
    var returnData = dependencyGraphTransform({
      graph: {
        nodes: [
          {
            "v": "atoms/form/button.hbs"
          },
          {
            "v": "atoms/form/input.hbs"
          },
          {
            "v": "atoms/form/checkbox.hbs"
          },
          {
            "v": "organisms/search/form.hbs"
          }
        ],
        edges: [
          {
            v: "organisms/search/form.hbs",
            w: "atoms/form/button.hbs"
          },
          {
            v: "organisms/search/form.hbs",
            w: "atoms/form/input.hbs"
          }
        ]
      }
    });

    asserts.assertArrayEquals(
      "should not have dependent patterns for input, checkbox and button",
      [],
      returnData["atoms-input"].dependentOn
        .concat(returnData["atoms-checkbox"].dependentOn)
        .concat(returnData["atoms-button"].dependentOn)
    );

    asserts.assertArrayEquals(
      "should have dependent patterns for form",
      [
        "atoms-button",
        "atoms-input"
      ],
      returnData["organisms-form"].dependentOn
    );
  }

  function shouldSkipJsonEdges() {
    var returnData = dependencyGraphTransform({
      graph: {
        nodes: [
          {
            "v": "atoms/form/button.hbs"
          },
          {
            "v": "atoms/form/input.hbs"
          },
          {
            "v": "atoms/form/checkbox.hbs"
          },
          {
            "v": "organisms/search/form.hbs"
          }
        ],
        edges: [
          {
            v: "atoms/form/button~hover.hbs",
            w: "atoms/form/button.hbs"
          },
          {
            v: "organisms/search/form.hbs",
            w: "atoms/form/button.hbs"
          },
          {
            v: "organisms/search/form.hbs",
            w: "atoms/form/input.hbs"
          }
        ]
      }
    });

    asserts.assertArrayEquals(
      "should not have dependent patterns for input, checkbox and button",
      [],
      returnData["atoms-input"].dependentOn
        .concat(returnData["atoms-checkbox"].dependentOn)
        .concat(returnData["atoms-button"].dependentOn)
    );

    asserts.assertArrayEquals(
      "should have dependent patterns for form",
      [
        "atoms-button",
        "atoms-input"
      ],
      returnData["organisms-form"].dependentOn
    );
  }

  function shouldSkipPatternlabMeta() {

    var returnData = dependencyGraphTransform({
      graph: {
        nodes: [
          {
            "v": "atoms/form/button.hbs"
          },
          {
            "v": "meta/_00-head.mustache"
          },
          {
            "v": "meta/_01-foot.mustache"
          },
          {
            "v": "organisms/teaser/article.hbs"
          }
        ],
        edges: []
      }
    });

    asserts.assertArrayEquals(
      "pattern states not excluded",
      [
        "atoms-button",
        "organisms-article"
      ],
      Object.keys(returnData)
    )
  }

  function shouldSkipPatternStates() {

    var returnData = dependencyGraphTransform({
      graph: {
        nodes: [
          {
            "v": "atoms/form/button.hbs"
          },
          {
            "v": "atoms/form/button~active.hbs"
          },
          {
            "v": "molecules/search/form.hbs"
          },
          {
            "v": "molecules/search/form~hover.hbs"
          },
          {
            "v": "organisms/teaser/article.hbs"
          },
        ],
        edges: []
      }
    });

    asserts.assertArrayEquals(
      "pattern states not excluded",
      [
        "atoms-button",
        "molecules-form",
        "organisms-article"
      ],
      Object.keys(returnData)
    )
  }

  function shouldSkipJsonNodes() {

    var returnData = dependencyGraphTransform({
      graph: {
        nodes: [
          {
            "v": "atoms/form/button.hbs"
          },
          {
            "v": "atoms/form/button.json"
          },
          {
            "v": "molecules/search/form.hbs"
          },
          {
            "v": "molecules/search/form.json"
          },
          {
            "v": "organisms/teaser/article.hbs"
          },
        ],
        edges: []
      }
    });

    asserts.assertArrayEquals(
      "pattern states not excluded",
      [
        "atoms-button",
        "molecules-form",
        "organisms-article"
      ],
      Object.keys(returnData)
    )
  }

  function shouldTransformPathToNodesIntoNames() {

    var returnData = dependencyGraphTransform({
      graph: {
        nodes: [
          {
            "v": "atoms/form/button.hbs"
          },
          {
            "v": "molecules/search/form.hbs"
          },
          {
            "v": "organisms/teaser/article.hbs"
          },
        ],
        edges: []
      }
    });

    asserts.assertArrayEquals(
      "not all nodes returned",
      [
        "atoms-button",
        "molecules-form",
        "organisms-article"
      ],
      Object.keys(returnData)
    )
  }

});
