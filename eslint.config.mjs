import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends('next/core-web-vitals', 'plugin:prettier/recommended'),

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      semi: ['error', 'always'], // 세미콜론 필수
      indent: ['error', 2], // 들여쓰기 2칸
      'linebreak-style': ['error', 'unix'], // 줄바꿈 LF (유닉스)
      quotes: ['error', 'single'], // 작은 따옴표 사용
      'prettier/prettier': 'error', // prettier와 충돌 방지
      eqeqeq: ['error', 'always'],
    },
  },
];
