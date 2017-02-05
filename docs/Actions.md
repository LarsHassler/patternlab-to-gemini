# Actions

For each pattern a number of actions can be defined, which will then be transformed
into separate test suites.

## Available Actions
- [hover](#hover)
- [focus](#focus)
- [sendKeys](#sendKeys)

## Options for all patterns

```
{
    "name": "hovered",
    "action": "hover",
    "selector": "input",
    "skipBrowsers": []
}
```

#### :exclamation: name

The name will be used for the testname, for example if the pattern id would be
***button*** and the name would be ***hovered*** the final test suite will be
called ***Button --- hovered***. This field is required.


#### :exclamation: action

The action that's being performed during the test.
See [available Actions](#available-actions) for valid actions.
This field is required.

#### selector (default '*')

An optional selector for the element, inside the pattern, the action is
performed on. Defaults to '*', which will be the first children inside the pattern.
But for patterns which are [loadOnSinglePage](#loadOnSinglePage-default-false)
it's necessary, because there the pattern is not wrapped and instead it is just
rendered as child nodes of the body.

#### skipBrowsers

An array of browsers to skip this action for.
See [Configuration](Configuration.md#skipBrowsers) for details on how to use this.

## hover

A particular element within a pattern will be tested while the mouse is hovering
over the element.

#### pseudoClass

An optional class name which should be used instead of an actual mouseMove.
See #22 for more details.


## focus

A particular element within a pattern will be tested while it is focused.

## sendKeys

Sends keyboard events an element before it beeing tested.
Custom options are: **keys**

#### :exclamation: keys

A String which will be sent to the element. This field is required.
