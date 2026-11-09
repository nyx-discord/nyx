module.exports = {
  'packages/**/src/**/*.ts': [
    'prettier --write',
    'eslint --cache --fix',
    'tsc-files --project ./configs/typescript-config/base.json --noEmit',
  ],
};
