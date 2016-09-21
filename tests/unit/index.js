var test = require('tape');
var normaliseCase = require('../../index');

test('normaliseCase exists', function (t) {
    t.plan(1);

    t.equal(typeof normaliseCase, 'function', 'normaliseCase is a function');
});

test('normalise convertion cases for pure strings', function (t) {
    var testCases = [
        { t: 'normalise', e: 'normalise' },
        { t: 'Normalise', e: 'normalise' },
        { t: 'NORMALISE', e: 'normalise' },
        { t: 'normaliseCase', e: 'normaliseCase' },
        { t: 'NormaliseCase', e: 'normaliseCase' },
        { t: 'NormaliseID', e: 'normaliseId' },
        { t: 'NormaliseHTML', e: 'normaliseHTML' },
        { t: 'NormaliseHTMLID', e: 'normaliseHtmlId' },
    ];

    t.plan(testCases.length);


    testCases.forEach(function (tc) {
        t.equal(normaliseCase(tc.t), tc.e, 'correct output for ' + tc.t);
    });
});

test('normalise supports transforming object keys', function (t) {
    t.plan(1);

    var testObj = {
        WrongCaseKey: 'Normal string, not being normalised',
        NestedObject: {
            HasKeyID: 123,
        },
    };

    var expectedObj = {
        wrongCaseKey: 'Normal string, not being normalised',
        nestedObject: {
            hasKeyId: 123,
        },
    };

    t.deepEqual(normaliseCase(testObj), expectedObj, 'correct transform of keys');
});

test('normalise supports walking through arrays to find objects to normalise', function (t) {
    t.plan(1);

    var testArray = [1, 2, 'String', { HorseUTCID: 'what' }];
    var expectedArray = [1, 2, 'String', { horseUtcId: 'what' }];

    t.deepEqual(normaliseCase(testArray), expectedArray, 'correct normalisation of an array containing and object');
});

test('normalise will not recurse any cyclic graph objects', function (t) {
    t.plan(2);

    var testObjA = {
        What: 'NO',
    };
    var testObjB = {
        This: testObjA,
    };
    testObjA.B = testObjB;

    var expectedObjA = {
        what: 'NO',
        b: testObjB,
    };

    var expectedObjB = {
        this: testObjA,
    };

    var testCyclicArray = ['String', testObjA, testObjB];
    var expectedArray = ['String', expectedObjA, expectedObjB];

    t.deepEqual(normaliseCase(testObjA), expectedObjA, 'only first level keys were transformed');
    t.deepEqual(normaliseCase(testCyclicArray), expectedArray, 'only first level keys of objects were transformed');
});

test('normalise should just return the obj if it is falsy', function (t) {
    t.plan(1);

    t.equal(normaliseCase(null), null, 'ok');
});
