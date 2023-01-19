'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-10-08T14:11:59.604Z',
    '2022-10-27T17:01:17.194Z',
    '2022-11-11T23:36:17.929Z',
    '2022-12-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-05-25T14:18:46.235Z',
    '2021-09-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-12-25T18:49:59.371Z',
    '2022-12-29T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Rajan Padariya',
  movements: [20000, -5000, -3400, -150, -790, -1000, -8500, 30300],
  interestRate: 0.5,
  pin: 2612,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2020-12-25T06:04:23.907Z',
    '2021-05-25T14:18:46.235Z',
    '2021-09-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-12-25T18:49:59.371Z',
    '2022-12-29T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////////////////////////////////////////////////

// // // // //Functions

const formatMovementsDates = (movDates, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(Math.round((date2 - date1) / (1 * 24 * 60 * 60 * 1000)));

  const daysPassed = calcDaysPassed(new Date(), movDates);
  // console.log(daysPassed);

  // const date = `${movDates.getDate()}`.padStart(2, 0);
  // const month = `${movDates.getMonth() + 1}`.padStart(2, 0);
  // const year = `${movDates.getFullYear()}`;

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // return `${date}/${month}/${year}, ${daysPassed} days passed`;

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat(locale, options).format(movDates);
};

const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sortParameter = false) {
  containerMovements.innerHTML = '';

  // console.log(acc.movements);

  const sortMovement = sortParameter
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  sortMovement.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const movDates = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementsDates(movDates, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// console.log(containerMovements.innerHTML);

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0).toFixed(3);

  // labelBalance.textContent = `${acc.balance}€`;
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(3);
  // labelSumIn.textContent = `${income}€`;
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  const out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  ).toFixed(3);
  // labelSumOut.textContent = `${out}€`;
  labelSumOut.textContent = formatCurrency(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(dep => dep > 0)
    .map(int => (int * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, totalInt, arr) => acc + totalInt, 0)
    .toFixed(3);
  // labelSumInterest.textContent = `${interest}€`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUserName = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

const updateUI = cuurentAcc => {
  //display movements
  displayMovements(cuurentAcc);

  //display balance
  calcDisplayBalance(cuurentAcc);

  //display summary
  calcDisplaySummary(cuurentAcc);
};

const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 60 + 30;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// // // // // // // // // EVENT HANDLER // // // // // // // //

let currentAccount, timer;

//////////////////////////////////////
//FAKE: ALWAYS LOGGED IN

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

/////////////////////////////////////

////////////////////////////////////
// // //Experimenting with Intl API

// const now = new Date();
// const options = {
//   day: 'numeric',
//   month: 'short',
//   year: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit',
// };

// // labelDate.textContent = new Intl.DateTimeFormat('en-IN', options).format(now);

// //using locale
// const locale = navigator.language;
// console.log(locale);
// labelDate.textContent = new Intl.DateTimeFormat('locale', options).format(now);

////////////////////////////////////////

btnLogin.addEventListener('click', e => {
  //Prevent form from submitting
  e.preventDefault();

  //////////////////create and display current date

  const now = new Date();

  ///////////////conventional way of generating and displaing dateand time/////////////////////

  // const date = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = `${now.getFullYear()}`;
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const minute = `${now.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${minute}`;

  //////////////////// //(Experimenting) Using Intl API//////////////////////////////////////

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  // labelDate.textContent = new Intl.DateTimeFormat('en-IN', options).format(now);

  // //using locale
  // const locale = navigator.language;
  // console.log(locale);

  ///////////////////////////////////

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    //display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    //timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //update UI
    updateUI(currentAccount);
  }
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    // doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Adding transfer date to movementsDate array

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      //Add movement
      currentAccount.movements.push(loanAmount);

      //add date to movementsDates array
      currentAccount.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentAccount);
      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 5000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    console.log(`delete`);
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //delete account
    accounts.splice(index, 1);
    //hideUI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'lightgrey';
    }
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////// LECTURES //////////////////////////////////////////

// ///////////////Conversion and Checking Numbers

// console.log(23 === 23.0);
// console.log(0.1 + 0.1);
// console.log(0.1 + 0.2);

// // // conversion
// console.log(Number('23'));
// console.log(+'23');

// // //parsing
// console.log(Number.parseInt('30pc', 10));
// console.log(Number.parseInt('exfat32', 10));

// console.log(Number.parseInt('2.5rem', 10));
// console.log(Number.parseFloat('2.5rem', 10));
// console.log(parseFloat('2.5rem', 10));

// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20px'));
// console.log(Number.isNaN(25 / 0));
// console.log(Number.isNaN(NaN));

// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20px'));
// console.log(Number.isFinite(25 / 0));
// console.log(Number.isFinite(NaN));

// console.log(Number.isInteger(25));
// console.log(Number.isInteger(25.0));
// console.log(Number.isInteger(25.235));
// console.log(Number.isInteger(25 / 0));

// ////////////Math And Rounding

// console.log(Math.sqrt(49));
// console.log(625 ** (1 / 2));
// console.log(27 ** (1 / 3));
// console.log(125 ** (1 / 3));

// console.log(Math.max(5, 13.39, 1, 25, 59, -5, 0.5, -45));
// console.log(Math.max(5, 13.39, 1, 25, '59', -5, 0.5, -45));
// console.log(Math.max(5, 13.39, 1, '25px', 59.54, -5, 0.5, -45));

// console.log(Math.min(5, 13.39, 1, 25, 59, -5, 0.5, -45));
// console.log(Math.min(5, 13.39, 1, 25, '59', -5, 0.5, -45.54));
// console.log(Math.min(5, 13.39, 1, '25px', 59, -5, 0.5, -45.54));

// console.log(Math.PI);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min)) + 1 + min;
// };
// console.log(randomInt(25, 50));

// console.log('ROUND method');
// console.log(Math.round(17.26));
// console.log(Math.round(17.97));
// console.log(Math.round(-17.26));
// console.log(Math.round(-17.97));

// console.log('CEIL method');
// console.log(Math.ceil(17.26));
// console.log(Math.ceil(17.97));
// console.log(Math.ceil(-17.26));
// console.log(Math.ceil(-17.97));

// console.log('FLOOR method');
// console.log(Math.floor(17.26));
// console.log(Math.floor(17.97));
// console.log(Math.floor(-17.26));
// console.log(Math.floor(-17.97));

// console.log('TRUNC method');
// console.log(Math.trunc(17.26));
// console.log(Math.trunc(17.97));
// console.log(Math.trunc(-17.26));
// console.log(Math.trunc(-17.97));

// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.735).toFixed(2));
// console.log(+(2.7).toFixed(0));

/////////////////Remainder operater

// console.log(5 / 2);
// console.log(5 % 2);

// const isEven = n => n % 2 === 0;

// console.log(isEven(5));
// console.log(isEven(16));
// console.log(isEven(-20));
// console.log(isEven(65132));

////////////////Numeric seprater

// console.log(25305124000000);
// console.log(25_305_124_000_000);
// console.log(Number('25_305_124_000_000'));

// //////////////////BigInt primitive (added in es2019)

// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 - 1);
// console.log(2 ** 53 + 0);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(2 ** 53 + 4);

// const x = 654987965n;
// console.log(x);

// const y = BigInt(654987965);
// console.log(y);

// console.log(x + y);
// console.log(x * y);

// const z = 17;
// // console.log(x * z);
// console.log(x * BigInt(z));

// // console.log(Math.sqrt(x));

// console.log(17n < 26);
// console.log(17n === 17);
// console.log(typeof 17n, typeof 17);

// console.log(x + ' is a BigInt number');
// console.log(z + ' is a regular number');

// console.log(10 / 3);
// console.log(10n / 3n);
// // console.log(10 / 3n);
// // console.log(10n / 3);

//////////////////////Date and Time

// const nowDate = new Date();
// console.log(nowDate);

// console.log(new Date('Apr 17 2023'));

// console.log(accounts);
// console.log(new Date(accounts[1].movementsDates[1]));

// console.log(new Date(2023, 11, 26, 5, 15, 25)); ////////month starts from 0 in JavaScript

// console.log(new Date(0));
// console.log(new Date(30 * 60 * 1000));
// console.log(new Date(1 * 24 * 60 * 60 * 1000));
// console.log(`Time Stamp for 1 Day ${1 * 24 * 60 * 60 * 1000}`);

// ////////methods on date (Working with dates)

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);

// console.log(future.getFullYear());
// console.log(future.getUTCFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// console.log(future.toISOString());

// console.log(future.getTime());

// console.log(new Date(future.getTime()));

// console.log(Date.now());

// future.setFullYear(2050);
// console.log(future);

///////////////operations with dates

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(Math.round((date2 - date1) / (1 * 24 * 60 * 60 * 1000)));

// console.log(calcDaysPassed(new Date(2037, 10, 19), new Date(2037, 10, 1)));

// ////////////////internationalizing numbers using Intl namescape

// const num = 2513.124;

// const options = {
//   style: 'currency',
//   currency: 'EUR',
//   // useGrouping: false,
// };

// console.log(`INDIA:    `, new Intl.NumberFormat('hi-IN', options).format(num));
// console.log(`US:    `, new Intl.NumberFormat('en-US', options).format(num));
// console.log(`UK:    `, new Intl.NumberFormat('en-GB', options).format(num));
// console.log(`ISRAEL:    `, new Intl.NumberFormat('hb-IL', options).format(num));
// console.log(
//   `GERMANY:    `,
//   new Intl.NumberFormat('de-DE', options).format(num)
// );

//////////////////// setTimeout() & setInterval()///////
// // //setTimeout()
// setTimeout(() => console.log('Hi! 😀 after 5sec'), 5000);
// console.log('Waiting..... ');

// const ingredients = ['spinach', 'olives'];
// const ingredients = ['mushroom', 'olives'];

// const pizzaTimer = setTimeout(
//   (item1, item2) => {
//     console.log(`here is your 🍕 with ${item1} & ${item2}`);
//   },
//   3000,
//   ...ingredients
// );
// if (ingredients.includes('spinach')) {
//   clearTimeout(pizzaTimer);
// }

// // //setInterval()
// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 5000);
