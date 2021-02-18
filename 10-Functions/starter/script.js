'use strict';

////////////////////////////
// Default parameters

// const bookings = [];

// const createBooking = function (
//   flightNum,
//   numPassengers = 1,
//   price = 199 * numPassengers
// ) {
//   // ES5
//   //   numPassengers = numPassengers || 1;
//   //   price = price || 199;

//   const booking = {
//     flightNum,
//     numPassengers,
//     price,
//   };

//   console.log(booking);
//   bookings.push(booking);
// };

// createBooking('LH132');
// createBooking('LH132', 2, 800);
// createBooking('LH132', 3);
// createBooking('LH132', 6);

// createBooking('LH132', undefined, 1000); // Skip middle param

///////////////////////////////////
// Passing arguments: Value vs Reference

// const flight = 'LH234';
// const jurijus = {
//   name: 'Jurijus Stankevicius',
//   passport: 2365447854,
// };

// const checkIn = function (flightNum, passenger) {
//   flightNum = 'LH999';
//   passenger.name = 'Mr. ' + passenger.name;

//   if (passenger.passport === 2365447854) {
//     alert('Checked in');
//   } else alert('Wrong passport!');
// };

// // checkIn(flight, jurijus);
// // console.log(flight);
// // console.log(jurijus);

// // Is the same as doing...
// // const flightNum = flight;
// // const passport = jurijus;

// const newPassport = function (person) {
//   person.passport = Math.trunc(Math.random * 100000000000000);
// };

// newPassport(jurijus);
// checkIn(flight, jurijus);

///////////////////////////////////
// Functions accepting callback functions

// const oneWord = function (str) {
//   return str.replaceAll(' ', '').toLowerCase();
// };

// const upperFirstWord = function (str) {
//   const [first, ...others] = str.split(' ');
//   return [first.toUpperCase(), ...others].join(' ');
// };

// // Higher-order function
// const transformer = function (str, fn) {
//   console.log(`Original string: ${str}`);
//   console.log(`Transformed string: ${fn(str)}`);

//   console.log(`Transformed by: ${fn.name}`);
// };

// transformer('JavaScript is the best!', upperFirstWord);
// transformer('JavaScript is the best!', oneWord);

// // JS uses callbacks all the time
// const high5 = function () {
//   console.log('👋');
// };
// document.body.addEventListener('click', high5);

// ['Jonas', 'Martha', 'Adam'].forEach(high5);

/////////////////////////////////////////
// Functions returning functions

// const greet = function (greeting) {
//   return function (name) {
//     console.log(`${greeting} ${name}`);
//   };
// };

// const greeterHey = greet('Hey');
// greeterHey('Jurijus');
// greeterHey('Steven');

// greet('Hello')('Jurijus');

// Challenge
// const greet = greeting => name => console.log(`${greeting} ${name}`);

// const greetArrow = greet('Hey');

// greetArrow('Jurijus');
// greetArrow('Jonas');

/////////////////////////////////////////
// Call and apply methods

// const lufthansa = {
//   airline: 'Lufthansa',
//   iataCode: 'LH',
//   bookings: [],
//   // book: function() {}
//   book(flightNum, name) {
//     console.log(
//       `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
//     );
//     this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
//   },
// };

// lufthansa.book(239, 'Jurijus Stankevicius');
// lufthansa.book(635, 'John Smith');
// console.log(lufthansa);

// const eurowings = {
//   airline: 'Eurowings',
//   iataCode: 'EW',
//   bookings: [],
// };

// const book = lufthansa.book;

// // book(23, 'Sarah Williams');

// // Call method
// book.call(eurowings, 54, 'Jurijus');
// console.log(eurowings);

// book.call(lufthansa, 239, 'Mary Cooper');
// console.log(lufthansa);

// const swiss = {
//   airline: 'Swiss Air Lines',
//   iataCode: 'LX',
//   bookings: [],
// };

// book.call(swiss, 583, 'MAry Cooper');
// console.log(swiss);

// // Apply method (uses array for arguments), not used as much anymore because of spread operator
// const flightData = [583, 'George Cooper'];
// book.apply(swiss, flightData);
// console.log(swiss);

// book.call(swiss, ...flightData);

// //////////////////////////////////////////
// // Bind method

// // book.call(eurowings, 23, 'Sarah Williams');
// const bookEW = book.bind(eurowings);
// const bookLH = book.bind(lufthansa);
// const bookLX = book.bind(swiss);

// bookEW(23, 'Steven Williams');

// const bookEW23 = book.bind(eurowings, 23);
// bookEW23('Jurijus Stankevicius');
// bookEW23('Martha Cooper');

// // With event listeners
// lufthansa.planes = 300;
// lufthansa.buyPlane = function () {
//   console.log(this);
//   this.planes++;
//   console.log(this.planes);
// };

// // lufthansa.buyPlane();

// document
//   .querySelector('.buy')
//   .addEventListener('click', lufthansa.buyPlane.bind(lufthansa));

// // Partial application

// const addTax = (rate, value) => value + value * rate;
// console.log(addTax(0.1, 200));

// const addVAT = addTax.bind(null, 0.23);
// // addVAT = value => value + value * 0.23;
// console.log(addVAT(100));
// console.log(addVAT(200));

// // Challenge
// const addTaxC = rate => value => console.log(value + value * rate);
// const addVATC = addTaxC(0.2);
// addVATC(400);

///////////////////////////////////////
// Coding Challenge #1

/* 
Let's build a simple poll app!

A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.

Here are your tasks:

1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
  1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
        What is your favourite programming language?
        0: JavaScript
        1: Python
        2: Rust
        3: C++
        (Write option number)
  
  1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1". 
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.

HINT: Use many of the tools you learned about in this and the last section 😉

BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?

BONUS TEST DATA 1: [5, 2, 3]
BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]

GOOD LUCK 😀
*/

// const poll = {
//   question: 'What is your favourite programming language?',
//   options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
//   // This generates [0, 0, 0, 0]. More in the next section 😃
//   answers: new Array(4).fill(0),
//   registerNewAnswer() {
//     const answer = Number(
//       prompt(
//         `${this.question} ${this.options.join('\n')}\n(Write option number)`
//       )
//     );
//     answer >= 0 && answer < this.options.length && this.answers[answer]++;

//     this.displayResults();
//     this.displayResults('string');
//   },

//   displayResults(type = 'array') {
//     if (type === 'string') {
//       console.log(`Poll results are: ${this.answers.join(', ')}`);
//     } else console.log(this.answers);
//   },
// };

// document
//   .querySelector('.poll')
//   .addEventListener('click', poll.registerNewAnswer.bind(poll));

// poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string');

// BONUS TEST DATA 1: [5, 2, 3]
// BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]

////////////////////////////////////////
// Immediately invoked function expressions (IIFE)

// const runOnce = function () {
//   console.log('This will never run again');
// };
// // runOnce();

// // IIFE
// (function () {
//   console.log('This will never run again');
//   const isPrivate = 23;
// })();

// // console.log(isPrivate);

// (() => console.log('This will ALSO never run again'))();

// {
//   const isPrivate = 23;
//   var notPrivate = 46;
// }

// console.log(notPrivate);
// // console.log(isPrivate);

//////////////////////////////////////
/////////////////////////////////////
// Closures

// const secureBooking = function () {
//   let passengerCount = 0;

//   return function () {
//     passengerCount++;
//     console.log(`${passengerCount} passengers`);
//   };
// };

// const booker = secureBooking();
// booker();
// booker();
// booker();

// console.dir(booker);

////////////////////////////////////////
// More cloure examples

// // Example 1
// let f;

// const g = function () {
//   const a = 23;
//   f = function () {
//     console.log(a * 2);
//   };
// };

// const h = function () {
//   const b = 777;
//   f = function () {
//     console.log(b * 2);
//   };
// };

// g();
// f();
// console.dir(f);

// // Reassigning f function
// h();
// f();
// console.dir(f);

// // Example 2
// const boardPassengers = function (n, wait) {
//   const perGroup = n / 3;

//   setTimeout(function () {
//     console.log(`We are now boarding all ${n} passengers`);
//     console.log(`There are 3 groups, each with ${perGroup} passengers`);
//   }, wait * 1000);

//   console.log(`Will start boarding in ${wait} seconds`);
// };

// const perGroup = 1000;
// boardPassengers(180, 3);

/* 
This is more of a thinking challenge than a coding challenge 🤓

Take the IIFE below and at the end of the function, attach an event listener that changes the color of the selected h1 element ('header') to blue, each time the BODY element is clicked. Do NOT select the h1 element again!

And now explain to YOURSELF (or someone around you) WHY this worked! Take all the time you need. Think about WHEN exactly the callback function is executed, and what that means for the variables involved in this example.

GOOD LUCK 😀
*/

(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';

  document.body.addEventListener('click', () => {
    header.style.color = 'blue';
  });
})();
