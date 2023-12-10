module.exports = {
  'packages/**/src/**/*.ts': [
    'eslint --cache --fix',
    'prettier --write',
    'tsc-files --noEmit',
  ],
};
