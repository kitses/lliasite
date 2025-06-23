import js from '@eslint/js';
import {defineConfig} from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {js}, extends: ['js/recommended'],
    rules: {
      'no-unused-vars': 'error',
      'no-useless-assignment': 'error',
      'require-atomic-updates': 'error',
      'curly': 'error',
      'eqeqeq': 'error',
      'no-use-before-define': 'warn',
    }
  },
  {files: ['**/*.{js,mjs,cjs}'], languageOptions: {globals: globals.browser}}
]);