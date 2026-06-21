import next from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'data/**',
      'docs/legacy-standalone-dashboard.html',
    ],
  },
  // Next.js recommended rules + Core Web Vitals for the app/ React code.
  ...next,
  // scripts/ are standalone Node CLI tools, not part of the Next app — give them Node globals.
  {
    files: ['scripts/**/*.js', '*.mjs', '*.config.{js,mjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    files: ['app/**/*.{js,jsx}'],
    rules: {
      // React Compiler-oriented rules from eslint-plugin-react-hooks v6. This project does
      // not use the React Compiler, and they fire on valid patterns here (selecting an icon
      // component from a static lookup, accumulating SVG geometry in a local inside a .map).
      // Keep them visible as warnings instead of blocking CI.
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  // Disable stylistic rules that Prettier owns, so the two never conflict. Must be last.
  prettier,
];

export default eslintConfig;
