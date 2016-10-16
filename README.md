# Patternlab to Gemini
[![npm version](https://badge.fury.io/js/patternlab-to-gemini.svg)](https://badge.fury.io/js/patternlab-to-gemini)
[![Build Status](https://travis-ci.org/LarsHassler/patternlab-to-gemini.svg)](https://travis-ci.org/LarsHassler/patternlab-to-gemini)
[![Coverage Status](https://coveralls.io/repos/github/LarsHassler/patternlab-to-gemini/badge.svg?branch=master)](https://coveralls.io/github/LarsHassler/patternlab-to-gemini?branch=master)
[![Dependencies](https://david-dm.org/LarsHassler/patternlab-to-gemini.svg)](https://david-dm.org/LarsHassler/patternlab-to-gemini)

I love [atomic design](http://atomicdesign.bradfrost.com) with [patternlab](http://patternlab.io).
But in combination with [gemini](https://github.com/gemini-testing/gemini), which provides utility for css regression tests,
it's an awesome workflow for working on large scale projects, redesigns and especially css refactoring.

The idea behind this project is to generate the test cases automatically from the styleguide of patternlab.

## Installation

This is a Node.js library. A soon as you have Node.js installed, just install it via npm:

```
$ npm install patternlab-to-gemini --save-dev
```

## Usage

#### Configuration

To start using patternlab-to-gemini you have to have a json config file.
See [Configuration](docs/Configuration.md) for detail info.

#### Start

As soon as you have you config file ready, you can generate your tests with the following command:

```
$ ./node_modules/.bin/patternlab-to-gemini -c path/to/your/configfile.json
```

You may also use `--debug` or `-d` to get debug output.
