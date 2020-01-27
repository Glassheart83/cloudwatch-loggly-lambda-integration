const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),
    testMatch: [
        '**/__tests__/**/*.ts?(x)', 
        '**/?(*.)+(spec|test).ts?(x)'
    ]
};
