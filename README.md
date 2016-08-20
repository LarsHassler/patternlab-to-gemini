# Patternlab to Gemini [![Build Status](https://travis-ci.org/LarsHassler/patternlab-to-gemini.svg?branch=master)](https://travis-ci.org/LarsHassler/patternlab-to-gemini)

I love [atomic design](http://atomicdesign.bradfrost.com) with [patternlab](http://patternlab.io). 
But in combination with [gemini](https://github.com/gemini-testing/gemini), which provides utility for css regression tests, 
it's an awesome workflow for working on large scale projects, redesigns and especially css refactoring.

The idea behind this project is to generate the test cases automatically from the styleguide of patternlab.

### Configuration

> For a detailed example also take a look at the example.config.json in the project root.

All relative paths will be resolve in relation to the main config file.

#### patternlabUrl (default: http://localhost:3000)

The domain where the patternlab styleguide is located.

```json
"patternlabUrl": "https://domainForPatternLab:1337"
```

#### screenSizes

A collection of screen sizes with will be used for the responsive screen shots. 
The key will be used for the filename of the screen shot.
Beware that the screen shot might be smaller due to the captured html element.

```json
"screenSizes": {
  "yourScreenSize": {
    "width": 999,
    "height": 666
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

### patternConfigFile

The path to the file with settings for specific patterns

```json
"patternConfigFile": "./pattern.config.json"
```

### outputFile (default: ./patternlabTests.js)

The path to the file where the generated tests will be stored. 

```json
"patternConfigFile": "./patternlabTests.js"
```

### templateFile (default: ./templates/main.js)

The path to the file where the templates for the tests.

```json
"templateFile": "./templates/main.js"
```
