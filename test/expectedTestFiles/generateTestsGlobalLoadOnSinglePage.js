
gemini.suite('Patternlab - ', function(patternlabSuite) {


  gemini.suite('Pattern Name 1', function(suite) {
    suite
        .setUrl('/styleguide/html/link-to-pattern1.html')
        .setCaptureElements('body')
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


