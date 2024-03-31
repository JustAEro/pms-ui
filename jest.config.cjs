module.exports = {
  rootDir: '.',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '.(test|spec).(js?|ts?)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: ['(tests/.*.mock).(jsx?|tsx?)$', '(.*).d.ts$'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$':
      'identity-obj-proxy',
    '@pms-ui/(.*)': '<rootDir>/src/$1',
  },
  verbose: true,
  testTimeout: 30000,
};
