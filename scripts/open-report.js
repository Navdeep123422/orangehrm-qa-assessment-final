const fs = require('node:fs');
const path = require('node:path');
const reporter = require('multiple-cucumber-html-reporter');
const json = path.resolve('reports/cucumber-report.json');
if (!fs.existsSync(json)) {
  console.error('No Cucumber JSON report found. Run npm test first.');
  process.exit(1);
}
reporter.generate({
  jsonDir: path.dirname(json),
  reportPath: path.resolve('reports/html'),
  metadata: { browser: { name: 'chromium' }, device: 'Local machine', platform: { name: process.platform } },
  reportName: 'OrangeHRM QA Assessment'
});
