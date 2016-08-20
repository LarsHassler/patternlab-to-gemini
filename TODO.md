##EPICS:
* Restructure/rename test data
* Add proper Documentation 
    * for pattern configuration
    * public api
    * constructor call with file path
    * cli mode
* Publish NPM Package
* Deal with pattern states
* Skipping screen sizes for specific pattern
* Additional screen sizes for specific pattern
* Overwriting screen sizes for specific pattern
* Skipping browsers for specific patterns
* Test for molecules and organisms should not run if an included pattern broke
    * get dependency tree out of patternlab
* Improve display of warnings
* Should work with not existing pattern config file

##USER STORIES: 

##TODOS:


##CONSIDERATIONS:
* [?] move browserSize into npm dependency (or maybe not??)
* [?] Add "Scope" css classes to specific pattern (maybe should be a feature inside patternlab ?)
* [?] error: pattern config is json file, but does not contain pattern configs