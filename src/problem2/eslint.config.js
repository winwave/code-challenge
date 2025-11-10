// @ts-check

import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    ...tseslint.configs.recommended,

    {
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      plugins: {
        'react': eslintPluginReact,
        'react-hooks': eslintPluginReactHooks,
        'jsx-a11y': eslintPluginJsxA11y,
      },
      rules: {
        ...eslintPluginReact.configs.recommended.rules,
        ...eslintPluginReactHooks.configs.recommended.rules,
        ...eslintPluginJsxA11y.configs.recommended.rules,

        'react/react-in-jsx-scope': 'off',
      },
      languageOptions: {
        globals: {
          browser: true,
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },

    {
      ignores: [
        'dist',
        'node_modules',
        'vite.config.ts',
        'postcss.config.js',
        'tailwind.config.js',
        'eslint.config.js',
      ],
    }
);
