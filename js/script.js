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


// _________________LISTENERS__________________

// page switching

menuHome.addEventListener('click', () => {
    document.body.classList.remove('black');
    switchPages(pageHome, [pageProducts, pageAbout]);
    showMenuBurger();
    document.body.classList.remove('no-scroll');
});

menuProducts.addEventListener('click', () => {
    showPageProducts();
    showMenuBurger();
    document.body.classList.remove('no-scroll');
});

menuAbout.addEventListener('click', () => {
    document.body.classList.add('black');
    switchPages(pageAbout, [pageHome, pageProducts])
    showMenuBurger();
    document.body.classList.remove('no-scroll');
});

allProductsBtn.addEventListener('click', () => {
    window.scrollTo(0, 0);
    showPageProducts();
});

showNowBtn.addEventListener('click', () => {
    window.scrollTo(0, 0);
    showPageProducts();
});

// end of page switching


// menu burger

menuBurger.addEventListener('click', () => {
    showMenuBurger();
    document.body.classList.toggle('no-scroll');
})

// end of menu burger

// filter

productsNavList.addEventListener('click', (e) => {
    if (e.target.classList.contains('products__navigation-buttons')) {
        selectItem(productsNavButtons, e.target);
        showCompanyItems(e.target.innerText);
    }
})

productsRangeInput.addEventListener('input', () => {
    countMaxPrice();
});

productsInput.addEventListener('keyup', () => {
    searchProductsInput();
});

// end of filter

// _________________END OF LISTENERS__________________



// _________________FUNCTIONS__________________

// content display

createTemplatePages();
showFilterButtons();

// end of content display


// find max price

function findMaxPrice(arr){
    const priceArr = arr.map(({price}) => price)
    return Math.max(...priceArr);
}

// end of find max price


// menu burger

function showMenuBurger(){
    menuBurger.classList.toggle('change');
    menuList.classList.toggle('appear');
}

// end of menu burger


//  switching pages

function switchPages(page, arr) {
    setActivePage(page);
    setInactivePage(arr);
};

function setActivePage(page) {
    page.classList.remove('hide');
};

function setInactivePage(arr) {
    arr.forEach(page => {
        page.classList.add('hide');
    })
};

function showPageProducts(){
    document.body.classList.add('black');
    switchPages(pageProducts, [pageHome, pageAbout]);
}

// end of switching pages


// filter

function selectItem(arr, item) {
    arr.forEach(el => {
        if (el === item) {
            el.setAttribute('id', 'selected');
        } else {
            el.removeAttribute('id');
        }
    });
}

function showCompanyItems(comp) {
    maxPriceValue = findMaxPrice(items);
    companyName = comp;

    clearProductsInput();

    const companyArr = items.filter(({id, company, image, price, name}) => {
        const statement = comp === company && price <= maxPriceValue && companyName.includes(company);
        
        if (statement) {
            return {id, company, image, price, name};
        } else if (comp === 'All' && price <= maxPriceValue) {
            companyName = items.map(({company}) => {
                return company;
            });
            return {id, company, image, price, name};
        } else {
            return false
        }
    });

    maxPriceValue = findMaxPrice(companyArr);
    productsRangeInput.max = maxPriceValue;
    productsRangeInput.value = maxPriceValue;
    outputMaxPrice.innerText = `Value: ${maxPriceValue}$`;
    
    displayFilterItems(companyArr);
};

function countMaxPrice() {
    maxPriceValue = productsRangeInput.value;
    outputMaxPrice.innerText = `Value: ${maxPriceValue}$`;

    clearProductsInput();
    
    const affordableArr = items.filter(({id, company, image, price, name}) => {
        const statement = price <= maxPriceValue && companyName.includes(company);

        if (statement) {
            return {id, company, image, price, name}
        } else {
            return false
        }
    });

    displayFilterItems(affordableArr);
};

function searchProductsInput() {
    value = productsInput.value.toLowerCase();
    const searchArr = items.map(({id, company, image, price, name}) => {
        const isVisible = value ? name.toLowerCase().includes(value) : true;
        const statement = isVisible && price <= maxPriceValue && companyName.includes(company);
        
        if (statement) {
            return {id, company, image, price, name};
        } else {
            return false
        }
    });

    displayFilterItems(searchArr);
};

function displayFilterItems(arr) {
    const pageProducts = Array.from(productsPageItems);
    const arrId = arr.map(({id}) => id);

    pageProducts.forEach(product => {
        if (arrId.includes(parseInt(product.getAttribute('data-item-id')))) {
            product.classList.remove('hide');
        } else {
            product.classList.add('hide');
        }
    });
}

function clearProductsInput(){
    value = '';
    productsInput.value = value;
}

function showFilterButtons() {
    let companyButtonTemplate = '';

    companyNameToShow.forEach(company => {
        companyButtonTemplate += `<li><button class="products__navigation-buttons" type="button">${company}</button></li>`;
    })

    productsNavList.insertAdjacentHTML('beforeend', companyButtonTemplate);
    productsNavButtons = productsNavList.querySelectorAll('.products__navigation-buttons');
};

// end of filter


// creating templates

function createTemplatePages() {
    homeItemsList.innerHTML = '';
    productsItemsList.innerHTML = '';
    if (items.length > 0) {
        items.forEach((item, index) => {
            if (index <= 2) {
                homeItemsList.innerHTML += showItemsOnPage(item);
                productsItemsList.innerHTML += showItemsOnPage(item);
            } else {
                productsItemsList.innerHTML += showItemsOnPage(item);
            }
        });
        productsPageItems = productsItemsList.querySelectorAll('.item');
    }
}

function showItemsOnPage({id, image, name, price}) {
    return `<div class="item" data-item-id="${id}">
                        <div class="item-image">
                            <img src=${image} alt="furniture">
                            <div class="item-inner">
                            </div>
                            <button class="item-button"><i class="fa-solid fa-cart-shopping"></i> Add to the cart</button>
                            <button class="item-button-added hide"><i class="fa-solid fa-cart-shopping"></i> Added to the cart</button>
                        </div>
                        <div class="item-name">${name}</div>
                        <div class="item-price">$${price}</div>
                    </div>`;
};

// end of creating templates

// _________________END OF FUNCTIONS__________________






