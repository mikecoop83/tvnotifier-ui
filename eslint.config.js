import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
	{
		ignores: [
			'.DS_Store',
			'node_modules',
			'build',
			'.svelte-kit',
			'package',
			'.env',
			'.env.*',
			'eslint.config.js',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock'
		]
	},
	{
		files: ['**/*.{js,cjs,mjs}'],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.browser
			}
		},
		extends: [js.configs.recommended]
	},
	{
		files: ['**/*.{ts,tsx}'],
		extends: [...tseslint.configs.recommended],
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname
			},
			globals: {
				...globals.node,
				...globals.browser
			}
		}
	},
	{
		files: ['**/*.svelte'],
		extends: [...svelte.configs['flat/recommended'], ...tseslint.configs.recommended],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: tseslint.parser
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	prettier
);
