import items from './data.json' assert {type: 'json'};

// _________________VARIABLES__________________

const menuHome = document.querySelector('.menu-home');
const pageHome = document.querySelector('.home');
const homeItemsList = document.querySelector('.home__items-list');

const menuProducts = document.querySelector('.menu-products');
const pageProducts = document.querySelector('.products');
const allProductsBtn = document.querySelector('.home__lower-button');
const showNowBtn = document.querySelector('.home__upper-button');
const productsItemsList = document.querySelector('.products__items-list');
const productsNavList = document.querySelector('.products__navigation-list');
const productsInput = document.querySelector('.products__input');
const outputMaxPrice = document.querySelector('#output');
const productsRangeInput = document.querySelector('.products__range-input');

const menuAbout = document.querySelector('.menu-about');
const pageAbout = document.querySelector('.about');

const cart = document.querySelector('.icon-wrapper');
const added = document.querySelector('.added');
const closeAdded = document.querySelector('.fa-xmark');
const addedItemsList = document.querySelector('.added__items-list');
const addedCheckout = document.querySelector('.added__checkout');
const addedTotal = document.querySelector('.added__total');
const addedAllAmount = document.querySelector('.added-amount');

const itemsList = document.querySelectorAll('.items-list');
const menuBurger = document.querySelector('.menu-burger');
const menuList = document.querySelector('.menu-list');

let maxPriceValue = findMaxPrice(items);

productsRangeInput.max = maxPriceValue;
productsRangeInput.value = maxPriceValue;

let productsNavButtons = '';
let value = '';
let total = 0;
let productsPageItems = 0;
let addedItems = JSON.parse(localStorage.getItem('added')) || [];

let companyName = items.map(({company}) => company);
const companyNameToShow = companyName.filter((item, i, arr) => arr.indexOf(item) === i);

const amountArr = JSON.parse(localStorage.getItem('amount')) || [];
let cartAllItems = 0;

// _________________ END OF VARIABLES__________________

