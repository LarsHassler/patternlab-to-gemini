##EPICS:
* [x] write pattern config into config file
* Template for test case structure
* Skipping screen sizes for specific pattern
    * move browserSize into npm dependency (or maybe not??)
* Add "Scope" css classes to specific pattern (maybe should be a feature inside patternlab ?)
* CLI mode
* Publish NPM Package
* Test for molecules and organisms should not run if an included pattern broke
    * get dependency tree out of patternlab

##USER STORIES:
* [x] users should be able to provide a path to the config file 
* config for new patterns should be added
* old configs patterns should not be overwritten
* Warning when pattern has been removed

##TODOS:
* [x] filesystem stubs for tests
* relative filepath should be relative to config file
* handle dir not created yet
* handle empty file
* error: files is not json
* error: json files, but does not contain configs
