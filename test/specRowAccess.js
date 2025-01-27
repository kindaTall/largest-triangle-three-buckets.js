/*global test:false, ok:false, largestTriangleThreeBuckets */

( function() {
  'use strict';
  function test(name, testFn) {
    console.log(`Test: ${name}`);
    testFn();
  }

  function ok(condition, message) {
    if (condition) {
      console.log(`✓ ${message}`);
    } else {
      console.log(`✗ ${message}`);
    }
  }
  const testLen = 2000;

  const sampleObjectData = [
    new Int32Array(testLen),
    new Float64Array(testLen)
  ]

  for (let i = 1; i < testLen; i++ ) {
    sampleObjectData[0][i] = i;
    sampleObjectData[1][i] = i + Math.random();
  }

  test( 'Library reduces length of data array to within threshold', function() {
    ok( largestTriangleThreeBucketsRF( sampleObjectData, 1440, 0, 1 )[0].length <= 1440, 'Returned data is <= threshold' );
  });

}() );
