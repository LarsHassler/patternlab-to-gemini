
gemini.suite('Patternlab - ', function(patternlabSuite) {
  patternlabSuite.setUrl('/styleguide/html/styleguide.html');

  gemini.suite('Pattern Name 1', function(suite) {
    suite
        .setCaptureElements(['#pattern-1 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


  gemini.suite('Pattern Name 1 --- hovered', function(suite) {
    suite
        .before(function(actions, find) {
          this.element = find('#pattern-1 .sg-pattern-example > *')
        })
        .setCaptureElements(['#pattern-1 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900)
            .moveMouse(this.element);
        });
  });


  gemini.suite('Pattern Name 1 --- focused', function(suite) {
    suite
        .before(function(actions, find) {
          this.element = find('#pattern-1 .sg-pattern-example > *')
        })
        .setCaptureElements(['#pattern-1 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900)
            .focus(this.element);
        });
  });


  gemini.suite('Pattern Name 1 --- sendKeys', function(suite) {
    suite
        .before(function(actions, find) {
          this.element = find('#pattern-1 .sg-pattern-example > *')
        })
        .setCaptureElements(['#pattern-1 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900)
            .sendKeys(this.element, 'inputString');
        });
  });


  gemini.suite('Pattern Name 2', function(suite) {
    suite
        .setCaptureElements(['#pattern-2 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


});


