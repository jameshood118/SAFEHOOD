// @ts-check
// This is the definitive ESLint Flat Config file (CJS format) for the SAFEHOOD Protocol.

const globals = require('globals');
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactRefreshPlugin = require('eslint-plugin-react-refresh');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const jsxA11y = require('eslint-plugin-jsx-a11y');

const allPlugins = {
  react: reactPlugin,
  'react-hooks': reactHooksPlugin,
  'react-refresh': reactRefreshPlugin,
  prettier: prettierPlugin,
  'jsx-a11y': jsxA11y,
};

module.exports = [
  // 1. GLOBAL IGNORES (Environment Optimization)
  {
    ignores: [
      'src/lib/database.types.ts', // Ignore machine-generated Supabase types
      '**/dist/**',
      '**/node_modules/**',
      '**/.eslintcache',
      'supabase/**', // Do not lint the Docker infrastructure
      '**/*.mjs',
      '.gitattributes',
    ],
  },

  // 2. BASE RULES
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3. REACT & HOOKS Configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: allPlugins,
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // Formatting Firewall
      'prettier/prettier': 'error',

      // Component Architecture
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react-refresh/only-export-components': 'off',

      // Logic Purity overrides
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // 🔒 Tightened: any is now an error (SAFEHOOD strictness)
      '@typescript-eslint/no-explicit-any': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],

      // --- MUI & SEMANTIC INTEGRITY (SAFEHOOD Protocol) ---
      // We block generic 'button' and 'a' tags to enforce MUI Button/Link for A11y
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXOpeningElement[name.name='button']",
          message:
            'Use MUI <Button /> instead to ensure WCAG 2.2 / Section 508 compliance.',
        },
        {
          selector: "JSXOpeningElement[name.name='a']",
          message:
            'Use MUI <Link /> or React Router <Link /> to maintain SAFEHOOD system integrity.',
        },
      ],

      // Accessibility Hardening (WCAG 2.2 AA)
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
    },
  },

  // 4. VITEST TESTS (Unit + RLS tests) - COMMENTED OUT UNTIL NEEDED

  // {
  //   files: ['tests/**/*.{test,spec}.{ts,tsx,js,jsx}'],
  //   languageOptions: {
  //     globals: {
  //       ...globals.node,
  //       ...globals.es2021,
  //       describe: 'readonly',
  //       it: 'readonly',
  //       test: 'readonly',
  //       expect: 'readonly',
  //       beforeAll: 'readonly',
  //       beforeEach: 'readonly',
  //       afterAll: 'readonly',
  //       afterEach: 'readonly',
  //       vi: 'readonly',
  //     },
  //   },
  // },


  // 5. PRETTIER (The Final Firewall)
  prettierConfig,
];
