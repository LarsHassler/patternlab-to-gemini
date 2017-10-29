
gemini.suite('Patternlab - ', function(patternlabSuite) {
  patternlabSuite.setUrl('/styleguide/html/styleguide.html');

  gemini.suite('Pattern Name 1', function(suite) {
    suite
        .setCaptureElements(['#pattern-1 .sg-pattern-example'])
        .ignoreElements([{"every":".ignore-selector-1"}])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


  gemini.suite('Pattern Name 2', function(suite) {
    suite
        .setCaptureElements(['#pattern-2 .sg-pattern-example'])
        .ignoreElements([{"every":".ignore-selector-2"},{"every":".ignore-selector-3"}])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        })
        .capture('tablet', function(actions, find) {
          actions.setWindowSize(1024, 768);
        });
  });


});


