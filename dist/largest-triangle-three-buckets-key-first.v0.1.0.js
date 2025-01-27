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
    root.largestTriangleThreeBuckets = factory();
  }
}( this, function() {
  'use strict';

  function largestTriangleThreeBuckets( data, threshold, xKey, yKey ) {

    var floor = Math.floor,
      abs = Math.abs,
      dataLength = data[xKey].length,
      x = data[xKey],
      y = data[yKey],
      sampledX = new (x.constructor)(threshold),
      sampledY = new (y.constructor)(threshold),
      sampled = {[xKey]: sampledX, [yKey]: sampledY},
      sampledIndex = 0,
      every = ( dataLength - 2 ) / ( threshold - 2 ), // Bucket size. Leave room for start and end data points
      a = 0, // Initially a is the first point in the triangle
      maxAreaPoint,
      maxArea,
      area,
      nextA,
      i,
      avgX = 0,
      avgY = 0,
      avgRangeStart,
      avgRangeEnd,
      avgRangeLength,
      rangeOffs,
      rangeTo,
      pointAX,
      pointAY;

    if ( threshold >= dataLength || threshold === 0 ) {
      return data; // Nothing to do
    }

    sampledX[ sampledIndex ] = x[ a ];
    sampledY[ sampledIndex ] = y[ a ];
    sampledX[ threshold - 1 ] = x[ dataLength - 1 ];
    sampledY[ threshold - 1 ] = y[ dataLength - 1 ];
    sampledIndex++;

    for ( i = 0; i < threshold - 2; i++ ) {

      // Calculate point average for next bucket (containing c)
      avgX = 0;
      avgY = 0;
      avgRangeStart = floor( ( i + 1 ) * every ) + 1;
      avgRangeEnd = floor( ( i + 2 ) * every ) + 1;
      avgRangeEnd = avgRangeEnd < dataLength ? avgRangeEnd : dataLength;

      avgRangeLength = avgRangeEnd - avgRangeStart;

      for ( ; avgRangeStart < avgRangeEnd; avgRangeStart++ ) {
        avgX += x[ avgRangeStart ] * 1; // * 1 enforces Number (value may be Date)
        avgY += y[ avgRangeStart ] * 1;
      }
      avgX /= avgRangeLength;
      avgY /= avgRangeLength;

      // Get the range for this bucket
      rangeOffs = floor( ( i + 0 ) * every ) + 1;
      rangeTo   = floor( ( i + 1 ) * every ) + 1;

      // Point a
      pointAX = x[ a ] * 1; // enforce Number (value may be Date)
      pointAY = y[ a ] * 1;

      maxArea = area = -1;

      for ( ; rangeOffs < rangeTo; rangeOffs++ ) {
        // Calculate triangle area over three buckets
        area = abs( ( pointAX - avgX ) * ( y[ rangeOffs ] - pointAY ) -
              ( pointAX - x[ rangeOffs ] ) * ( avgY - pointAY )
              ) * 0.5;
        if ( area > maxArea ) {
          maxArea = area;
          maxAreaPoint = rangeOffs;
          nextA = rangeOffs; // Next a is this b
        }
      }

      sampledX[ sampledIndex ] = x[ maxAreaPoint ];
      sampledY[ sampledIndex ] = y[ maxAreaPoint ];
      sampledIndex++;
      a = nextA; // This a is the next a (chosen b)
    }

    return sampled;
  }

  // Return a value to define the module export.
  return largestTriangleThreeBuckets;
} ) );
