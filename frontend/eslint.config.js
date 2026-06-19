import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * Configuração do ESLint para o projeto.
 * Aplica regras recomendadas de JS, React Hooks e React Refresh (Vite).
 */
export default defineConfig([
  // Ignora a pasta de build para não analisar ficheiros compilados.
  globalIgnores(['dist']),
  {
    // Aplica as regras a todos os ficheiros JS e JSX do projeto.
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Permite variáveis não utilizadas se começarem por maiúscula ou underscore (ex.: componentes React).
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
