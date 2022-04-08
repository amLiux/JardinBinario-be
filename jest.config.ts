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
	testURL: "http://localhost/"
};

export default config;