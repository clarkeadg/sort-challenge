
/**
 * Sort Challenge
 * An experiment to find the best way to sort a group of numbers
 */

(function() {

  /**
   * generateRandomNumbers
   * generates a random number set
   */  
  function generateRandomNumbers(total,min,max) {
    var numbers = [];
    for(var i=0;i<total;i++) {
      numbers.push(getRandomNumber(min, max));
    }
    return numbers;
  }

  /**
   * getRandomNumber
   * generates a random number
   */
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * indexSort
   * Sorts numbers using array indexes
   * Limitations:
   * - duplicate numbers get lost
   * - doesn't work with negative numbers
   * - only sorts in 1 direction
   * - breaks if number range is too large
   */
  function indexSort(numbers) {
    var indexSort = [];
    for(var i=0,c=numbers.length;i<c;i++) {
      indexSort[numbers[i]] = true; // this breaks if set has 2 of same number
    }
    var sorted = [];
    for(var i=0,c=indexSort.length;i<c;i++) {
      if(indexSort[i]) sorted.push(i);
    }
    return sorted;
  }

  /**
   * indexSortWithDuplicates
   * Sorts numbers using array indexes and solves duplicate number problem
   * Limitations:
   * - doesn't work with negative numbers
   * - only sorts in 1 direction
   * - breaks if number range is too large
   */
  function indexSortWithDuplicates(numbers) {
    var indexSort = [];
    for(var i=0,c=numbers.length;i<c;i++) {
      indexSort[numbers[i]] ? indexSort[numbers[i]].push(true) : indexSort[numbers[i]] = [true];
    }
    var sorted = [];
    for(var i=0,c=indexSort.length;i<c;i++) {
      if(indexSort[i]) {
        for(var i2=0,c2=indexSort[i].length;i2<c2;i2++) {
          sorted.push(i);
        }
      }
    }
    return sorted;
  }

  /**
   * indexSortMediumRange
   * Sorts a medium sized number range by transforming numbers into a grid system
   * Limitations:
   * - Able to sort numbers with a range up to 10,000
   */
  function indexSortMediumRange(numbers,backwards) {
    
    // make grid from unsorted array
    var max = 10;
    var grid = {};
    var negativeGrid = {};
    for(var i=0,c=numbers.length;i<c;i++) {
      // - get number
      var number = numbers[i];

      //- figure out outer array slot based on divisions of max
      var Y = (Math.floor(number/max));    

      //- figure out inner array slot based on max (14 uses slot 4, 87 uses slot 7, 10 uses slot 0)
      var X = number - (Y * max);      

      //console.log('number',number,'X',X,'Y',Y)

      // negative grid hack to hopefully solve object order problem
      if (Y < 0) {
        Y = -Y;
        if (!negativeGrid[Y]) negativeGrid[Y] = [];
        negativeGrid[Y][X] ? negativeGrid[Y][X].push(number) : negativeGrid[Y][X] = [number]; 
      } else {
        if (!grid[Y]) grid[Y] = [];
        grid[Y][X] ? grid[Y][X].push(number) : grid[Y][X] = [number];
      }
    }
    console.log(negativeGrid);
    console.log(grid);
    
    // transform grid to sorted array
    var sorted = [];
    // this does not always go in order
    for(var i in negativeGrid) {
      //console.log(grid[i]);
      for(var i2=negativeGrid[i].length+1,c2=-1;i2>c2;i2--) {
        //console.log(grid[i][n]);
        if (negativeGrid[i][i2]) {
          for(var i3=0,c3=negativeGrid[i][i2].length;i3<c3;i3++) {
            sorted.unshift(negativeGrid[i][i2][i3]);
          }
        }
      }
    }
    for(var i in grid) {
      //console.log(grid[i]);
      for(var i2 in grid[i]) {
        //console.log(grid[i][n]);        
        for(var i3=0,c3=grid[i][i2].length;i3<c3;i3++) {
          sorted.push(grid[i][i2][i3]);
        }        
      }
    }

    // sort direction
    if (backwards) {
      var sortedBackwards = [];
      for(var i=0,c=sorted.length;i<c;i++) {
        sortedBackwards.unshift(sorted[i]);
      }
      sorted = sortedBackwards;
    }

    return sorted;
  }

  /**
   * indexSortLargeRange
   * Sorts a large sized number range by transforming numbers into a grid system
   * - still not as good as Array.sort() but it is close
   * - Able to sort 100 million numbers, range 50
   * - Able to sort 1,000 numbers, range 100 billion
   */
  function indexSortLargeRange(numbers,backwards) {    

    var max = 4096; // max numbers per row, this number makes a huge performance difference
    
    // positive numbers
    var grid = [];
    var gridYmap = {};
    var Row = -1;

    // negative numbers
    var nGrid = [];
    var nGridYmap = {};
    var nRow = -1;
    
    // loop numbers and make grid
    for(var i=0,c=numbers.length;i<c;i++) {
      // - get number
      var number = numbers[i];

      //- figure out outer array slot based on divisions of max
      var Y = (Math.floor(number/max));    

      //- figure out inner array slot based on max (14 uses slot 4, 87 uses slot 7, 10 uses slot 0)
      var X = number - (Y * max);      

      //console.log('number',number,'X',X,'Y',Y)

      // negative grid hack
      if (Y < 0) {
        Y = -Y;
        // make row
        //console.log(Row,Y)
        if (typeof nGridYmap[Y] =='undefined') {
          nRow++;
          nGridYmap[Y] = nRow;
          nGrid[nRow] = [];
          nGrid[nRow][X] = [number];
        } else {
          nGrid[nGridYmap[Y]][X] ? nGrid[nGridYmap[Y]][X].push(number) :  nGrid[nGridYmap[Y]][X] = [number];
        }
      } else {
        // make row
        //console.log(Row,Y)
        if (typeof gridYmap[Y] =='undefined') {
          Row++;
          gridYmap[Y] = Row;
          grid[Row] = [];
          grid[Row][X] = [number];
        } else {
          grid[gridYmap[Y]][X] ? grid[gridYmap[Y]][X].push(number) :  grid[gridYmap[Y]][X] = [number];
        }
      }
    }

    //console.log(grid,gridYmap);

    // Positive Numbers
    // get row numbers map and make new array
    var preSort = [];
    for(var i in gridYmap) {      
      preSort[i] = grid[gridYmap[i]]; 
    }

    var sorted = [];
    for(var i=0,c=preSort.length;i<c;i++) {
      if(preSort[i]) {
        for(var i2=0,c2=preSort[i].length;i2<c2;i2++) {
          if (preSort[i][i2]) {
            for(var i3=0,c3=preSort[i][i2].length;i3<c3;i3++) {
              sorted.push(preSort[i][i2][i3]);
            }
          }
        }
      }
    }

    // Negative Numbers
    var nPreSort = [];
    for(var i in nGridYmap) {      
      nPreSort[i] = nGrid[nGridYmap[i]]; 
    }

    for(var i=0,c=nPreSort.length;i<c;i++) {
      if(nPreSort[i]) {
        for(var i2=0,c2=nPreSort[i].length;i2<c2;i2++) {
          if (nPreSort[i][i2]) {
            for(var i3=0,c3=nPreSort[i][i2].length;i3<c3;i3++) {
              sorted.unshift(nPreSort[i][i2][i3]);
            }
          }
        }
      }
    }

    // sort direction
    if (backwards) {
      var sortedBackwards = [];
      for(var i=0,c=sorted.length;i<c;i++) {
        sortedBackwards.unshift(sorted[i]);
      }
      sorted = sortedBackwards;
    }

    return sorted;
  }

  /**
   * indexSortSuperLargeRange
   * Attempts tp Sorts a large sized number range by transforming numbers into a X/Y/Z grid system
   * - Not as good as indexSortLargeRange
   */
  function indexSortSuperLargeRange(numbers,backwards) {
    var X = 0;
    var Y = 0;
    var Z = 0;
    var maxX = 4096;
    var maxY = 4096;    
    var positiveGrid = {};
    var negativeGrid = {};
    var xUnsortedNumbers = [];
    var yUnsortedNumbers = [];
    var zUnsortedNumbers = []; 
    var xNumbers = [];
    var yNumbers = [];
    var zNumbers = [];    
    var sorted = [];
    /*     
      yNumbers = [],
      sortedYNumbers = [],
      xNumbers = [],
      sortedXNumbers = [],
      sorted = [],
      sortedBackwards = [];
    */
    
    // Loop through numbers, and put into grid objects
    for(var i=0,c=numbers.length;i<c;i++) {
      X = numbers[i];
      Y = Math.floor(X/maxX); 
      Z = Math.floor(Y/maxY);
      
      // positive numbers
      if (Y > -1) {
        if (!positiveGrid[Z]) {
          positiveGrid[Z] = {};
        }
        if (!positiveGrid[Z][Y]) {
          positiveGrid[Z][Y] = {};
        }        
        if (!positiveGrid[Z][Y][X]) {
          positiveGrid[Z][Y][X] = 1;
        } else  {
          positiveGrid[Z][Y][X]++;
        }      
      } else {
        // Negative Numbers
        X = -X;
        Y = -Y;
        Z = -Z;
        if (!negativeGrid[Z]) {
          negativeGrid[Z] = {};
        }
        if (!negativeGrid[Z][Y]) {
          negativeGrid[Z][Y] = {};
        }        
        if (!negativeGrid[Z][Y][X]) {
          negativeGrid[Z][Y][X] = 1;
        } else {
          negativeGrid[Z][Y][X]++;
        } 
      }
    }
    //console.log(positiveGrid);
    //console.log(negativeGrid);

    // NEGATIVE NUMBERS

    // Loop through grid objects, and put into arrays
    zUnsortedNumbers = [];
    for(var i in negativeGrid) {
      zUnsortedNumbers.push(+i);
    }
    zNumbers = indexSort(zUnsortedNumbers);
    for(var i=0,c=zNumbers.length;i<c;i++) {
      for(var i2 in negativeGrid[zNumbers[i]]) {
        yNumbers.push(+i2); 
      }
      yNumbers = indexSort(yNumbers);
      for(var i2=0,c2=yNumbers.length;i2<c2;i2++) {
        for(var i3 in negativeGrid[zNumbers[i]][yNumbers[i2]]) {
          xNumbers.push(+i3);        
        }
        xNumbers = indexSort(xNumbers);
        for(var i3=0,c3=xNumbers.length;i3<c3;i3++) {
          if (negativeGrid[zNumbers[i]][yNumbers[i2]]) {
            for(var i4=0;i4<negativeGrid[zNumbers[i]][yNumbers[i2]][xNumbers[i3]];i4++) {
              sorted.unshift(-(+xNumbers[i3]));
            }
          } 
        }        
      }
    }

    // POSITIVE NUMBERS

    zUnsortedNumbers = [];
    for(var i in positiveGrid) {
      zUnsortedNumbers.push(+i);
    }
    zNumbers = indexSort(zUnsortedNumbers);
    for(var i=0,c=zNumbers.length;i<c;i++) {
      for(var i2 in positiveGrid[zNumbers[i]]) {
        yNumbers.push(+i2); 
      }
      yNumbers = indexSort(yNumbers);
      for(var i2=0,c2=yNumbers.length;i2<c2;i2++) {
        for(var i3 in positiveGrid[zNumbers[i]][yNumbers[i2]]) {
          xNumbers.push(+i3);        
        }
        xNumbers = indexSort(xNumbers);
        for(var i3=0,c3=xNumbers.length;i3<c3;i3++) {
          if (positiveGrid[zNumbers[i]][yNumbers[i2]]) {
            for(var i4=0;i4<positiveGrid[zNumbers[i]][yNumbers[i2]][xNumbers[i3]];i4++) {
              sorted.push(+xNumbers[i3]);
            }
          } 
        }        
      }
    }

    // sort direction
    if (backwards) {
      var sortedBackwards = [];
      for(var i=0,c=sorted.length;i<c;i++) {
        sortedBackwards.unshift(sorted[i]);
      }
      sorted = sortedBackwards;
    }

    return sorted;
  }

  function init() {

    //var numbers = generateRandomNumbers(2,1,20); // tiny set
    //var numbers = generateRandomNumbers(6,1,20); // super small set
    //var numbers = generateRandomNumbers(10,1,50); // small set
    //var numbers = generateRandomNumbers(10000000,1,50); // small set, lots of numbers
    //var numbers = generateRandomNumbers(10,-50,50); // small set with negatives
    //var numbers = generateRandomNumbers(10,1,5); // small set with dupes
    //var numbers = generateRandomNumbers(100,-100000,100000); // negatives
    //var numbers = generateRandomNumbers(100,1,100000); // medium set
    //var numbers = generateRandomNumbers(100,-1000,1000); // medium set with negatives
    //var numbers = generateRandomNumbers(10,-1000000,1000000); // large set with negatives
    //var numbers = generateRandomNumbers(100,1,100000000); // extra large set
    //var numbers = generateRandomNumbers(100,-100000000,100000000); // extra large set with negatives
    //var numbers = generateRandomNumbers(500,-50000000000,50000000000); // super extra large set with negatives
    
    // my best
    //var numbers = generateRandomNumbers(10000000,1,50); // almost overheats computer but works
    var numbers = generateRandomNumbers(1000,-50000000000,50000000000); // super extra large set with lots of numbers

    // beyond my skill
    //var numbers = generateRandomNumbers(1000000,-50000000000,50000000000); // super extra large set with lots of numbers

    // beyond native js sort
    //var numbers = generateRandomNumbers(100000000,-50000000000,50000000000); // super extra large set with lots of numbers


    //console.log(numbers,numbers.length); 

    //var sorted = indexSort(numbers);
    //var sorted = indexSortWithDuplicates(numbers);
    //var sorted = indexSortMediumRange(numbers,false);
    var sorted = indexSortLargeRange(numbers,false);
    //var sorted = indexSortSuperLargeRange(numbers,false); // failed, not as good as indexSortLargeRange

    // test to see if native js sort function will work with number set
    //var sorted = numbers.sort();

    console.log(sorted,sorted.length);    
  }

  init();

})();


