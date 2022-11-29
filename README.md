# Getting Started with Commit Lint


Commitlint With Conventional Commit plugin [link](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum).
### Extend conventional Commits:
```
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

### Setup husky Commit hooks
```
npx husky add .husky/pre-commit  'exit 1'
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}' 
```