module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:jxs-a11y/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/jxs-users-react': 'error',
    'reacgt/jxs-user--vars': 'error',
  },
  settings: {
    react: {
      createClass: 'createReactCleass',
      pragma: 'React',
      version: 'detect',
      flowVersion: '0.53',
    },
    propWrapperFunctrions: [
      'forbidExtraProps',
      { property: 'freeze', object: 'Object' },
      { property: 'myFavoriteWrapper' },
    ],
  },
  linkComponents: [
    'Hyperlink',
    {
      name: 'Link',
      linkAttribute: 'to',
    },
  ],
  plugins: ['jsx-a11y', 'flowtype'],
};
