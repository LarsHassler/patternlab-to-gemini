#!/bin/sh

## Checking if all changes are added to the index
CWD_CLEAN="$(git diff-index HEAD --)"

if test -n "$CWD_CLEAN"; then
## There are changes that are not added yet
## We don't want to run test on theses changes, therefore we'll stash them
git stash -q --keep-index --include-untracked
fi

## Running the check
STD_OUT=$(npm run pre-commit --silent)
## Getting the exit code of the check
HAD_ERROR=$?

if test -n "$CWD_CLEAN"; then
## We have do pop the changes, which have been stashed before, back to the
## workspace
git stash pop -q
fi

if test "$HAD_ERROR" != 0 ; then
## Printing the stderr of the checks
echo ${STD_OUT}
exit 1
fi

exit 0
