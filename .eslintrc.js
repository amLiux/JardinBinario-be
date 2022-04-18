module.exports = {
	root: true,
	env: {
		browser: true,
		amd: true,
		node: true,
		es2021: true,
		jest: true,
	},
	ignorePatterns: ['lib', 'tests/lambdas/*.js', 'tests/manuel/*.js', 'app/**/*.js', 'documentation'],
	rules: {
		'no-console': 'off',
		'import/prefer-default-export': 'off',
		'no-tabs': 0,
		'max-len': 0,
		indent: ['error', 'tab', {
			SwitchCase: 1
		}],
		'no-prototype-builtins': 0,
		'linebreak-style': 'off',
		'arrow-body-style': 0,
		'react/jsx-filename-extension': 'off',
		'import/extensions': 0,
		'no-param-reassign': ['error', { props: false }],
		'no-trailing-spaces': ['error', { skipBlankLines: true, ignoreComments: true }],
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
			},
		},
	},
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: './tsconfig.json',
			},
			plugins: [
				'@typescript-eslint',
			],
			extends: [
				'plugin:@typescript-eslint/recommended',
			],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/explicit-module-boundary-types': ['warn', {
					allowArgumentsExplicitlyTypedAsAny: true,
				}],
				'@typescript-eslint/explicit-member-accessibility': ['error'],
				'react/jsx-filename-extension': 'off',
				'import/extensions': 'off',
				'@typescript-eslint/indent': ['error', 'tab'],
				'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			},
		},
	],
};
