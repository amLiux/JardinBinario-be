import type { InitialOptionsTsJest } from 'ts-jest';

const config: InitialOptionsTsJest = {
	moduleFileExtensions: ["ts", "js", "json"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest"
	},
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json"
		}
	},
	testPathIgnorePatterns: ["/node_modules/", "/dist/", "/lib/", "/build/"],
	verbose: true,
	testEnvironment: 'jest-environment-jsdom',
	testEnvironmentOptions: {
		url: 'http://localhost',
	},
};

export default config;