
gemini.suite('Patternlab - ', function(patternlabSuite) {
  patternlabSuite.setUrl('/styleguide/html/styleguide.html');

  gemini.suite('Pattern Name 1', function(suite) {
    suite
        .skip(/chrome/, 'skipped via patternlab-to-gemini config')
        .skip(/ie/, 'custom comment')
        .setCaptureElements(['#pattern-1 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
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


