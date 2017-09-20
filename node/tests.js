'use strict';

var _test_unit = require('./test_unit.js');

var _test_integration = require('./test_integration.js');

(0, _test_unit.run_unit_tests)();
(0, _test_integration.run_integration_tests)();

console.log('');
process.exit(0);
