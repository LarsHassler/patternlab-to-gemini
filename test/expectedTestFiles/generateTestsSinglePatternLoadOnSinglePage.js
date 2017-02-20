
gemini.suite('Patternlab - ', function(patternlabSuite) {
  patternlabSuite.setUrl('/styleguide/html/styleguide.html');

  gemini.suite('Pattern Name 1', function(suite) {
    suite
        .setCaptureElements(['#pattern-1 .sg-pattern-example'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


  gemini.suite('Pattern Name 2', function(suite) {
    suite
        .setUrl('/styleguide/html/link-to-pattern2.html')
        .setCaptureElements('body')
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        });
  });


});


