
gemini.suite('Atoms - ', function(patternlabSuite) {
  patternlabSuite.setUrl('/styleguide/html/styleguide.html');

  gemini.suite('Pattern Name 1', function(suite) {
    suite
        .setCaptureElements(['#atoms-pattern-1 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


  gemini.suite('Pattern Name 2', function(suite) {
    suite
        .setCaptureElements(['#atoms-pattern-2 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


});

gemini.suite('Molecules - ', function(patternlabSuite) {
  patternlabSuite.setUrl('/styleguide/html/styleguide.html');

  gemini.suite('Pattern Name 3', function(suite) {
    suite
        .setCaptureElements(['#molecules-pattern-3 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


  gemini.suite('Pattern Name 4', function(suite) {
    suite
        .setCaptureElements(['#molecules-pattern-4 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


});


