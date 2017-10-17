# Configuration

> For a detailed example also take a look at the example.config.json in the project root.

All relative paths will be resolve in relation to the main config file.
Required variables are marked with a :exclamation:.
Variables marked with a :skull: are deprecated and will be removed in the near
future.

#### :exclamation: patternlabUrl (default: http://localhost:3000)

The domain where the patternlab styleguide is located.

```json
"patternlabUrl": "https://domainForPatternLab:1337"
```

#### :exclamation: screenSizes

A collection of screen sizes with will be used for the screen shots.
The key will be used for the filename of the screen shot.
Beware that the screen shot might be smaller due to the captured html element.
They can be referenced in [defaultSizes](#defaultSizes) and pattern specific
settings [screenSizes](#screenSizes), [additionalScreenSizes](#additionalScreenSizes),
[excludeScreenSizes](#excludeScreenSizes)

```json
"screenSizes": {
  "yourScreenSize": {
    "width": 999,
    "height": 666
  }
}
```

#### defaultSizes

An array containing keys of the [screenSizes](#exclamation-screensizes).
For all of these sizes every pattern will be taken a screen shot of,
if not defined otherwise in the pattern specific configuration.
See [screenSizes](#screenSizes), [additionalScreenSizes](#additionalScreenSizes)
and [excludeScreenSizes](#excludeScreenSizes) for details.

```json
"defaultSizes": ["yourScreenSize-1", "yourScreenSize-2"]
```

#### loadOnSinglePage (default: false)

A boolean to determine if the screenshots should be taken on the rendered pages
of the single patterns or if the screenshots should be taken on the styleguide
page.

This can also be set only on [specific patterns](#loadOnSinglePage-default-false--if-global-loadOnSinglePage-is-also-false)

```json
"loadOnSinglePage": false
```

#### groupTestsByType (default: false)

A boolean to determine if the tests should be grouped by pattern type. By default
this is off and so the tests are all under one parentSuite in gemini named
 "Patternlab"

```json
"groupTestsByType": false
```

#### excludePatterns

An array containing regular expressions to exclude patterns for the tests.

```json
"excludePatterns": [
  "^templates"
]
```
#### excludeImplicit (default: false)

A switch to change the behavior how to process patterns.
By default if a pattern is found in the markup, which is not defined in the 
`patterns` section of the patternlab-to-gemini configuration, it will be 
screenshotted in all defined screensizes.
If this is set to `true` only the patterns which are defined in the 
patternlab-to-gemini config are screenshotted.

```json
"excludeImplicit": true
```

#### excludeStates

An array containing regular expressions to exclude patterns by an assigned state
See http://patternlab.io/docs/pattern-states.html.

```json
"excludeStates": [
  "inprogress",
  "ideas",
]
```

#### outputFile (default: ./patternlabTests.js)

The path to the file where the generated tests will be stored.

```json
"patternConfigFile": "./patternlabTests.js"
```

#### :skull: patternConfigFile

> Pattern settings are part of the main config file. See [patterns](#patterns)

The path to the file which contains settings for specific patterns.

```json
"patternConfigFile": "./pattern.config.json"
```

#### patterns

An object containing pattern specific configuration.
The key has to map a pattern id from the styleguide. The object can contain any
number of [pattern specific configuration](#pattern-specific-configuration).

```json
"patterns": {
    "pattern-id": {}
}
```

#### templateFile (default: ./templates/main.js)

The path to the file where the templates for the tests.

```json
"templateFile": "./templates/main.js"
```


# Pattern specific configuration

> These settings previously were part of the [patternconfigfile](#patternconfigfile).

#### loadOnSinglePage (default: false - if global loadOnSinglePage is also false)

If the screenshot of this pattern should be taken on a single page instead of
the default styleguide page.
This is necessary for patterns that have elements that are fixed or absolutely
positioned.
> :warning: If this is active the [selectors](#selectors) config has to be set also

> :warning: If the [global loadOnSinglePage](#loadonsinglepage-default-false) is activated this is 
always true, and can't be overwritten


#### screenSizes

An array of the globally defined [screenSizes](#exclamation-screensizes). This will
overwrite the screen shot sizes for this pattern.

```json
{
    "patterns": {
        "pattern-id": {
            "screenSizes": ["size1", "size2"]
        }
    }
}
```

> :warning: Can not be used with [additionalScreenSizes](#additionalScreenSizes) or
[excludeScreenSizes](#excludeScreenSizes) on the same pattern.
Pattern screen shot sizes can either be overwritten or modified, but not both.

#### additionalScreenSizes

An array of the globally defined [screenSizes](#exclamation-screensizes). These
screen shots will be taken in addition to the [defaultSizes](#defaultSizes).

```json
{
    "patterns": {
        "pattern-id": {
            "additionalScreenSizes": ["size1", "size2"]
        }
    }
}
```

> :warning: Can not be used with [screenSizes](#screenSizes) on the same pattern.
Pattern screen shot sizes can either be overwritten or modified, but not both.

#### captureElements

An array of custom selectors which are use for the screenshot. 
By default we use the `.sg-pattern-example` inside the `#pattern-id`,
or the `body` if [loadOnSinglePage](#loadOnSinglePage-default-false--if-global-loadOnSinglePage-is-also-false)
is active.

#### ignoreElements

An array of custom selectors which are ignored when comparing screenshots. 

#### excludeScreenSizes

An array of the globally defined [screenSizes](#exclamation-screensizes). The
screen shots in these sizes will not be taken if the are part of the
[defaultSizes](#defaultSizes).

```json
{
    "patterns": {
        "pattern-id": {
            "excludeScreenSizes": ["size1", "size2"]
        }
    }
}
```

> :warning: Can not be used with [screenSizes](#screenSizes) on the same pattern.
Pattern screen shot sizes can either be overwritten or modified, but not both.

#### actions

An array of actions which should be used to generate test cases. Each action will
be transformed into a new test suite.
For more details see the [Actions Documentation](Actions.md).

```
{
    "patterns": {
        "pattern-id": {
            "actions": [
                ...action settings...
            ]
        }
    }
}
```

#### skipBrowsers

An array of browsers for which the pattern should not be tested. The browsers are
either defined just as a regexp string or as an object, containing a comment and
the regexp.
These have to match an browser id of your gemini config.

```
{
    "patterns": {
        "pattern-id": {
            "skipBrowsers": [
                "chrome",
                {
                    "comment": "ie10 does not properly handle this pattern",
                    "browser": "internetExplorer10"
                }
            ]
        }
    }
}
```
