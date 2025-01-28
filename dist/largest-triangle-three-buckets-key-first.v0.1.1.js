/*
 * The MIT License

Copyright (c) 2014 Josh Carr
With Portions Copyright (c) 2013 by Sveinn Steinarsson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Uses AMD or browser globals to create a module.

// Grabbed from https://github.com/umdjs/umd/blob/master/amdWeb.js.
// Check out https://github.com/umdjs/umd for more patterns.

// Defines a module "largest-triangle-three-buckets".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

/*global define*/
( function( root, factory ) {
  'use strict';
  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as an anonymous module.
    define( [], factory );
  } else {
    // Browser globals
    root.largestTriangleThreeBucketsRF = factory();
  }
}( this, function() {
  'use strict';

  function largestTriangleThreeBucketsRF( data, threshold, xKey, yKey ) {

    const {floor, abs, min} = Math;
    const dataLength = data[xKey].length;
    if ( threshold >= dataLength || threshold === 0 ) return data
    const [x, y] = [data[xKey], data[yKey]];
    const sampledX = new (x.constructor)(threshold);
    const sampledY = new (y.constructor)(threshold);
    const sampled = {[xKey]: sampledX, [yKey]: sampledY};
    let sampledIndex = 1;
    const every = ( dataLength - 2 ) / ( threshold - 2 ); // Bucket size. Leave room for start and end data points
    let a = 0; // Initially a is the first point in the triangle

    [sampledX[ 0 ], sampledY[ 0 ]] = [x[ 0 ], y[ 0 ]];
    [sampledX[ threshold - 1 ], sampledY[ threshold - 1 ]] = [x[ dataLength-1 ], y[dataLength-1 ]];

    for (let i = 0; i < threshold - 2; i++ ) {
      const avgRangeStart = floor( ( i + 1 ) * every ) + 1;
      const avgRangeEnd = min(floor( ( i + 2 ) * every ) + 1, dataLength);
      const avgRangeLength = avgRangeEnd - avgRangeStart;

      let [avgX, avgY] = [0, 0];

      for (let j = avgRangeStart; j < avgRangeEnd; j++ ) {
        avgX += +x[ j ];
        avgY += +y[ j ];
      }
      [avgX, avgY] = [avgX / avgRangeLength, avgY / avgRangeLength];

      // Get the range for this bucket
      const rangeStart = floor( ( i + 0 ) * every ) + 1;
      const rangeEnd   = floor( ( i + 1 ) * every ) + 1;

      // Point a
      const pointAX = +x[ a ];
      const pointAY = +y[ a ];

      let [maxArea, maxAreaPoint] = [-1, 0];

      for (let j = rangeStart ; j < rangeEnd; j++ ) {
        // Calculate triangle area over three buckets
        const area = abs( ( pointAX - avgX ) * ( y[ j ] - pointAY ) -
              ( pointAX - x[ j ] ) * ( avgY - pointAY )
              ); //  * 0.5;
        if ( area > maxArea ) {
          [maxArea, maxAreaPoint] = [area, j];
          a = j;
        }
      }

      [sampledX[sampledIndex], sampledY[sampledIndex]] = [x[maxAreaPoint], y[maxAreaPoint]];
      sampledIndex++;

    }

    return sampled;
  }

  // Return a value to define the module export.
  return largestTriangleThreeBucketsRF;
} ) );
