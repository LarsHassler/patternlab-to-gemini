# Patternlab to Gemini [![Build Status](https://travis-ci.org/LarsHassler/patternlab-to-gemini.svg?branch=master)](https://travis-ci.org/LarsHassler/patternlab-to-gemini)

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

#### Quickstart

As soon as you have you config file ready, you can generate your tests with the following command:
  
```
$ ./node_modules/.bin/patternlab-to-gemini -c path/to/your/configfile.json
```
