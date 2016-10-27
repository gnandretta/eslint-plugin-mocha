'use strict';

var RuleTester = require('eslint').RuleTester,
    rules = require('../../').rules,
    ruleTester = new RuleTester(),
    expectedErrorMessage = 'Do not pass arrow functions to it()';

ruleTester.run('no-mocha-arrows', rules['no-mocha-arrows'], {

    valid: [
        'it()',
        'it(function() { assert(something, false); })',
        'it("should be false", function() { assert(something, false); })',
        {
            // In this example, `it` is not a global.
            code: 'function it () {}; it(() => { console.log("okay") })',
            parserOptions: { ecmaVersion: 6 }
        },
        'it.only()',
        'it(function(done) { assert(something, false); done(); })',
        {
            code: 'it(function*() { assert(something, false) })',
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: 'it(async function () { assert(something, false) })',
            parserOptions: { ecmaVersion: 2017 }
        }
    ],

    invalid: [
        {
            code: 'it(() => { assert(something, false); })',
            parserOptions: { ecmaVersion: 6 },
            errors: [ { message: expectedErrorMessage, column: 1, line: 1 } ],
            output: 'it(function () { assert(something, false); })'
        },
        {
            code: 'it(() => { assert(something, false); })',
            globals: [ 'it' ],
            parserOptions: { ecmaVersion: 6 },
            errors: [ { message: expectedErrorMessage, column: 1, line: 1 } ],
            output: 'it(function () { assert(something, false); })'
        },
        {
            code: 'it(() => assert(something, false))',
            parserOptions: { ecmaVersion: 6 },
            errors: [ { message: expectedErrorMessage, column: 1, line: 1 } ],
            output: 'it(function () { return assert(something, false); })'
        },
        {
            code: 'it("should be false", () => { assert(something, false); })',
            parserOptions: { ecmaVersion: 6 },
            errors: [ { message: expectedErrorMessage, column: 1, line: 1 } ],
            output: 'it("should be false", function () { assert(something, false); })'
        },
        {
            code: 'it.only(() => { assert(something, false); })',
            parserOptions: { ecmaVersion: 6 },
            errors: [ { message: 'Do not pass arrow functions to it.only()', column: 1, line: 1 } ],
            output: 'it.only(function () { assert(something, false); })'
        },
        {
            code: 'it((done) => { assert(something, false); })',
            parserOptions: { ecmaVersion: 6 },
            errors: [ { message: expectedErrorMessage, column: 1, line: 1 } ],
            output: 'it(function (done) { assert(something, false); })'
        },
        {
            code: 'it("should be false", () => {\n assert(something, false);\n})',
            parserOptions: { ecmaVersion: 6 },
            errors: [ { message: expectedErrorMessage, column: 1, line: 1 } ],
            output: 'it("should be false", function () {\n assert(something, false);\n})'
        },
        {
            code: 'it(async () => { assert(something, false) })',
            parserOptions: { ecmaVersion: 2017 },
            errors: [ { message: expectedErrorMessage, column: 1, line: 1 } ],
            output: 'it(async function () { assert(something, false) })'
        }
    ]

});
