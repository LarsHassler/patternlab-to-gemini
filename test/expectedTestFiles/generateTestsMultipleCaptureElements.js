
gemini.suite('Patternlab - ', function(patternlabSuite) {
  patternlabSuite.setUrl('/styleguide/html/styleguide.html');

  gemini.suite('Pattern Name 1', function(suite) {
    suite
        .setCaptureElements(['.element1', '#element2'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        })
        .capture('tablet', function(actions, find) {
          actions.setWindowSize(1024, 768);
        });
  });


  gemini.suite('Pattern Name 2', function(suite) {
    suite
        .setCaptureElements(['#elements3 > *', '.element4'])
        .capture('desktop', function(actions, find) {
          actions.setWindowSize(1440, 900);
        })
        .capture('tablet', function(actions, find) {
          actions.setWindowSize(1024, 768);
        });
  });


});


