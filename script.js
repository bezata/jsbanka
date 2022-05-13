'use strict';

const account1 = {
  owner: 'Behzat Can',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2022-05-13T21:31:17.178Z',
    '2022-05-12T07:42:02.383Z',
    '2022-05-11T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-03-08T14:11:59.604Z',
    '2022-02-27T17:01:17.194Z',
    '2022-01-11T23:36:17.929Z',
    '2022-01-09T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Mina Ç',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1111,
  movementsDates: [
    '2022-05-13T21:31:17.178Z',
    '2022-05-12T07:42:02.383Z',
    '2022-05-11T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-03-08T14:11:59.604Z',
    '2022-02-27T17:01:17.194Z',
    '2022-01-11T23:36:17.929Z',
    '2022-01-09T10:51:36.790Z',
  ],
};

const account3 = {
  owner: 'Batuhan A',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 1111,
  movementsDates: [
    '2022-05-13T21:31:17.178Z',
    '2022-05-12T07:42:02.383Z',
    '2022-05-11T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-03-08T14:11:59.604Z',
    '2022-02-27T17:01:17.194Z',
    '2022-01-11T23:36:17.929Z',
    '2022-01-09T10:51:36.790Z',
  ],
  currency: 'TRY',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Eren C',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 1111,
  movementsDates: [
    '2022-05-13T21:31:17.178Z',
    '2022-05-12T07:42:02.383Z',
    '2022-05-11T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-03-08T14:11:59.604Z',
    '2022-02-27T17:01:17.194Z',
    '2022-01-11T23:36:17.929Z',
    '2022-01-09T10:51:36.790Z',
  ],
  currency: 'TRY',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];
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
const formatMovements = function (date) {
  const calcDays = (d1, d2) =>
    Math.abs(Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
  const daysPass = calcDays(new Date(), date);
  if (daysPass === 0) return 'Bugün';
  if (daysPass === 1) return 'Dün';
  if (daysPass <= 7) return `${daysPass} gün önce`;
  else {
    return `${daysPass} gün önce`;
  }
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  const hour = `${date.getHours()}`;
  const minute = `${date.getMinutes()}`.padStart(2, 0);
  return `${day}/${month}/${year}, ${hour}:${minute}`;
};
const displayMovements = function (acc, sort = true) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'yatırma' : 'çekme';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovements(date);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}₺</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}₺`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₺`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₺`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}₺`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Tekrar hoşgeldin, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(Number(inputLoanAmount.value));
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`;
const minute = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

// day //month // year
