# Patternlab to Gemini

I love [atomic design](http://atomicdesign.bradfrost.com) with [patternlab](http://patternlab.io). 
But in combination with [gemini](https://github.com/gemini-testing/gemini), which provides utility for css regression tests, 
it's an awesome workflow for working on large scale projects, redesigns and especially css refactoring.

The idea behind this project is to generate the test cases automatically from the styleguide of patternlab.

### Configuration

> For a detailed example also take a look at the example.config.json in the project root.

#### patternlabUrl (default: http://localhost:3000)

The domain where the patternlab styleguide is located.

```json
"patternlabUrl": "https://domainForPatternLab:1337"
```

#### screenSizes

A collection of screen sizes with will be used for the responsive screen shots. The key will be used for the filename of the screen shot.
Beware that the screen shot might be smaller due to the captured html element.

```json
"screenSizes": {
  "yourScreenSize": {
    "width": 999,
    "height: 666
  }
}
```

### excludePatterns

An array containing regular expressions to exclude patterns for the tests.

```json
"excludePatterns": [
  "^templates"
]
```
