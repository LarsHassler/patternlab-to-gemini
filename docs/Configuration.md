# Configuration

> For a detailed example also take a look at the example.config.json in the project root.

All relative paths will be resolve in relation to the main config file.

#### patternlabUrl *required* (default: http://localhost:3000)

The domain where the patternlab styleguide is located.

```json
"patternlabUrl": "https://domainForPatternLab:1337"
```

#### screenSizes *required*

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

The path to the file which contains settings for specific patterns.

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
