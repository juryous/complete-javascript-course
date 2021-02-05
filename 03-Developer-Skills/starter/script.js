// Remember, we're gonna use strict mode in all scripts now!
'use strict';

///////////////////////////////////////
// Using Google, StackOverflow and MDN

// PROBLEM 1:
// We work for a company building a smart home thermometer. Our most recent task is this: "Given an array of temperatures of one day, calculate the temperature amplitude. Keep in mind that sometimes there might be a sensor error."

// const temperatures = [3, -2, -6, -1, 'error', 9, 13, 17, 15, 14, 9, 5];

// 1) Understanding the problem
// - What is temp amplitude? Answer: difference between highest and lowest temp
// - How to compute the max and min temperatures?
//  What's a sensor error? And what to do?

// 2) Breaking up into sub-problems
// - How to ignore errors?
// - Find max value in temp array
// - Find min value in temp array
// - Substract min from max (amplitude) and return it

// function calcTempAmplitude(temps) {
//   const onlyNums = [];
//   for (let i = 0; i < temps.length; i++) {
//     if (typeof temps[i] !== 'number') continue;
//     onlyNums.push(temps[i]);
//   }
//   return Math.max(...onlyNums) - Math.min(...onlyNums);
// }

// const amplitude = calcTempAmplitude(temperatures);

// console.log(amplitude);

// PROBLEM 2:
// Function should nowreceive 2 arrays of temps

// 1) Understanding the problem
// - With 2 arrays, should we implement functionality twice? NO! We should merge two arrays

// 2) Breaking up into sub-problems
// - Merge two arrays?

// function calcTempAmplitudeNew(temps1, temps2) {
//   const temps = temps1.concat(temps2);
//   const onlyNums = [];
//   for (let i = 0; i < temps.length; i++) {
//     if (typeof temps[i] !== 'number') continue;
//     onlyNums.push(temps[i]);
//   }
//   return Math.max(...onlyNums) - Math.min(...onlyNums);
// }

// const amplitudeNew = calcTempAmplitudeNew([3, 5, 1], [9, 0, 5]);

// console.log(amplitudeNew);

////////////////////////////////////
// Debugging with the console and breakpoints

// function measureKelvin() {
//   const measurement = {
//     type: 'temp',
//     unit: 'celsius',
//     // value: +prompt('Degrees celsius:'),
//     value: 10,
//   };

//   const kelvin = measurement.value + 273;
//   return kelvin;
// }

// console.log(measureKelvin());

// /// Using a debugger
// const calcTempAmplitudeBug = function (t1, t2) {
//   const temps = t1.concat(t2);
//   //   console.log(temps);

//   let max = 0;
//   let min = 0;

//   for (let i = 0; i < temps.length; i++) {
//     const curTemp = temps[i];
//     if (typeof curTemp !== 'number') continue;

//     if (curTemp > max) max = curTemp;
//     if (curTemp < min) min = curTemp;
//   }
//   console.log(max, min);
//   return max - min;
// };
// const amplitudeBug = calcTempAmplitudeBug([3, 5, 1], [9, 4, 5]);
// // A) IDENTIFY
// console.log(amplitudeBug);

///////////////////////////////////////
// Coding Challenge #1

/*
Given an array of forecasted maximum temperatures, the thermometer displays a string with these temperatures.

Example: [17, 21, 23] will print "... 17ºC in 1 days ... 21ºC in 2 days ... 23ºC in 3 days ..."

Create a function 'printForecast' which takes in an array 'arr' and logs a string like the above to the console.

Use the problem-solving framework: Understand the problem and break it up into sub-problems!

TEST DATA 1: [17, 21, 23]
TEST DATA 2: [12, 5, -5, 0, 4]
*/

// 1) Understanding the problem
// How to print temps and days from an array? Answer: use a for loop

// 2) Breaking up into sub-problems
// Loop over the array
// print the string including temps and days
// print the string in one line

const arr1 = [17, 21, 23];
const arr2 = [12, 5, -5, 0, 4];

function printForecast(arr) {
  let result = '';

  for (let i = 0; i < arr.length; i++) {
    result += `... ${arr[i]}ºC in ${i + 1} days `;
  }

  console.log(result + '...');
}

printForecast(arr2);
