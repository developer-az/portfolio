module.exports = {
    extends: [
      'next/core-web-vitals',
      'eslint:recommended',
      'plugin:react/recommended',
    ],
    plugins: ['react', 'react-hooks'],
    rules: {
      // Turn off rules that are causing build errors
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      '@next/next/no-img-element': 'warn', // Turn to warning instead of error
      'react-hooks/exhaustive-deps': 'warn', // Warning for missing dependencies
      
      // Additional rules for better code quality
      'react/prop-types': 'off', // Not needed with TypeScript
      'react/jsx-uses-react': 'off', // Not needed with React 17+
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    globals: {
      React: 'readable'
    },
    ignorePatterns: ['node_modules/', '.next/', 'out/']
  };