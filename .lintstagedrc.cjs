module.exports = {
  'packages/**/src/**/*.ts': [
    'prettier --write',
    'eslint --config ./configs/eslint-config/base.js --cache --fix',
    'tsc-files --project ./configs/typescript-config/base.json --noEmit',
  ],
};
