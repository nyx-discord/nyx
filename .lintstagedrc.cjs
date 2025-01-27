module.exports = {
  'packages/**/src/**/*.ts': [
    'prettier --write',
    'eslint --cache --fix',
    'tsc-files --noEmit',
  ],
};
