module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    parallel: 1,
    retry: 0,
    timeout: 30000
  }
};
