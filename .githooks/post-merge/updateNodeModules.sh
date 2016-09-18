#!/bin/bash
# MIT © Sindre Sorhus - sindresorhus.com
# forked by Gianluca Guarini

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
  echo "$changed_files" | grep --quiet "$1" && eval "$2"
}

# `npm install` and `npm prune` if the `package.json` file gets changed
# to update all the nodejs ( grunt ) dependencies deleting the unused packages (not listed into the  `package.json` file)
check_run package.json "npm install && npm prune"
