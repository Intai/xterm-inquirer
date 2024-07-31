var env = (process.env.NODE_ENV === 'production') ? 'prod' : 'dev'
var isDevelopment = env !== 'prod'

module.exports = {
  'parserOptions': {
    'ecmaVersion': 13,
    'sourceType': 'module',
  },
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
  ],
  'globals': {
    'CONFIG': 'readonly',
  },
  'rules': {
    'array-bracket-spacing': 'warn',
    'arrow-spacing': 'warn',
    'block-spacing': 'warn',
    'brace-style': 'warn',
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': 'warn',
    'computed-property-spacing': 'warn',
    'eol-last': ['warn', 'always'],
    'func-call-spacing': 'warn',
    'indent': ['error', 2],
    'key-spacing': 'warn',
    'keyword-spacing': 'warn',
    'linebreak-style': 'warn',
    'multiline-ternary': ['warn', 'always-multiline'],
    'no-console': isDevelopment ? 'off' : 'error',
    'no-constant-condition': isDevelopment ? 'off' : 'error',
    'no-debugger': isDevelopment ? 'off' : 'error',
    'no-trailing-spaces': 'warn',
    'no-unused-vars': ['warn', {
      'argsIgnorePattern': '^_',
    }],
    'no-use-before-define': 'warn',
    'object-curly-spacing': ['warn', 'always'],
    'operator-linebreak': ['warn', 'before'],
    'prefer-const': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'sort-imports': ['warn', {
      'ignoreCase': true,
      'ignoreDeclarationSort': true,
    }],
    'space-before-blocks': 'warn',
    'space-before-function-paren': ['warn', {
      'anonymous': 'never',
      'asyncArrow': 'always',
      'named': 'never',
    }],
    'space-in-parens': 'warn',
    'space-infix-ops': 'warn',
  },
}
