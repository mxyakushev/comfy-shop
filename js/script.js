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


// cart ( show / hide )

cart.addEventListener('click', () => {
    document.body.classList.add('dark-background');
    document.body.style.overflow = 'hidden';
    added.classList.add('pop-up');
});

closeAdded.addEventListener('click', () => {
    document.body.classList.remove('dark-background');
    document.body.style.overflowY = 'scroll';
    added.classList.remove('pop-up');
});

// end of cart ( show / hide )


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


// item buttons

homeItemsList.addEventListener('click', (e) => {
    checkIfContainsButton(e);
});

productsItemsList.addEventListener('click', (e) => {
    checkIfContainsButton(e);
});

// end of item buttons


// removing items from cart

addedItemsList.addEventListener('click', (e) => {
    removeAddedItems(e);
    countAddedItemsAmount(e);
});

// end of removing items from cart

// _________________END OF LISTENERS__________________



// _________________FUNCTIONS__________________

// content display

createTemplatePages();
createTemplateCart();
countMaxPrice();
showFilterButtons();
checkButtonsCondition();

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


// item button

function checkIfContainsButton(e) {
    if (e.target.classList.contains('item-button')) {
        addToCart(e.target);
    }
}

function addToCart(button) {
    const item = button.closest('.item');
    const itemId = item.getAttribute('data-item-id');

    items.forEach(item => {
        if (item.id === parseInt(itemId)) {
            addedItems.push(item);
            localStorage.setItem('added', JSON.stringify(addedItems));
            createTemplateCart();
        }
    });

    checkButtonsCondition();
};

// end of item button


// buttons condition

function checkButtonsCondition(){
    const itemsOnThePage = document.querySelectorAll('.item');

    itemsOnThePage.forEach(allItems => {
        addedItems.forEach(itemsInCart => {
            if(itemsInCart.id === parseInt(allItems.getAttribute('data-item-id'))){
                const buttonProducts = allItems.querySelector('.item-button');
                const buttonAddedProducts = allItems.querySelector('.item-button-added');

                buttonProducts.classList.add('hide');
                buttonAddedProducts.classList.remove('hide');
            }
        })
    })
    
}

// buttons condition


// count total

function countTotal(price) {
    total += price;

    if (total > 0) {
        addedCheckout.classList.remove('hide');
    } else {
        addedCheckout.classList.add('hide');
    }

    addedTotal.innerText = `Total: $${total}`;
}

// end of count total


// removing items from cart

function removeAddedItems(e) {
    if (e.target.classList.contains('added__item-remove')) {
        const item = e.target.closest('.added__item');
        let itemToRemove;
        addedItems.forEach(el => {
            if (el.id === parseInt(item.getAttribute('data-item-id'))) {
                itemToRemove = el;
            }
        });

        addedItems = addedItems.filter(el => {
            if (el === itemToRemove) {
                return false
            } else {
                return el
            }
        });

        createTemplateCart();
        localStorage.setItem('added', JSON.stringify(addedItems));

        const itemAmountInCart = item.querySelector('.added__item-amount');
        let elementToDelete;

        amountArr.forEach(el => {
            if (parseInt(el[1]) === itemToRemove.id) {
                elementToDelete = el;
                amountArr.splice(amountArr.indexOf(elementToDelete), 1)
                localStorage.setItem('amount', JSON.stringify(amountArr));
            }
        });

        countTotal(-(itemToRemove.price * parseInt(itemAmountInCart.innerText)));

        itemsList.forEach(list => {
            const listOfItems = list.querySelectorAll('.item');
            listOfItems.forEach(el => {
                if (el.getAttribute('data-item-id') === item.getAttribute('data-item-id')) {
                    el.querySelector('.item-button').classList.remove('hide');
                    el.querySelector('.item-button-added').classList.add('hide');
                }
            });
        });

        cartAllItems = 0;
        countHowManyAdded(cartAllItems);

        if (addedItems.length > 0) {
            createTemplateCart();
        }
    }
}

// end of removing items from cart


// increase products in the cart

function countAddedItemsAmount(e){
    if(e.target.classList.contains('angle')){
        let itemAmount = 0;
        
        increaseItems(e);
        decreaseItems(e);
        itemAmount = parseInt(e.target.closest('.added__item').querySelector('.added__item-amount').innerText);

        amountArr.push([itemAmount, e.target.closest('.added__item').getAttribute('data-item-id')]);
        const amountArrLastEl = amountArr[amountArr.length - 1];

        if (amountArr.length > 1) {
            for (let i = 0; i < amountArr.length - 1; i++) {
                if (amountArr[i][1] === amountArrLastEl[1]) {
                    amountArr.splice(i, 1);
                }
            }
        };
        localStorage.setItem('amount', JSON.stringify(amountArr));
    }
}

function decreaseItems(e){
    if (e.target.classList.contains('fa-angle-down')) {
        const amountEl = e.target.previousElementSibling;
        let amount = parseInt(e.target.previousElementSibling.innerText);

        if (amount >= 2) {
            amount--;
        }
        amountEl.innerText = amount;
        showAmountOfItemInCart();
    }
}

function increaseItems(e){
    if (e.target.classList.contains('fa-angle-up')) {
        const amountEl = e.target.nextElementSibling;
        let amount = parseInt(e.target.nextElementSibling.innerText);

        if (amount < 10) {
            amount++;
        }
        amountEl.innerText = amount;
        showAmountOfItemInCart();
    }
}

// end of increase products in the cart


// how many items in the cart

function countHowManyAdded(num) {
    addedAllAmount.innerText = num;
};

// end of how many items in the cart


// count how many items in cart

function showAmountOfItemInCart(){
    cartAllItems = 0;
    total = 0;
    countTotal(0);
    const howManyItems = document.querySelectorAll('.added__item');
    howManyItems.forEach(item => {
        cartAllItems += parseInt(item.querySelector('.added__item-amount').innerText);
        countTotal((parseInt(item.querySelector('.added__item-price').innerText.slice(1))) * (parseInt(item.querySelector('.added__item-amount').innerText)));
    });
    countHowManyAdded(cartAllItems);
}

// end of count how many items in cart


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

function createTemplateCart() {
    addedItemsList.innerHTML = '';
    if(addedItems.length > 0) {
        addedItems.forEach(item => {
            addedItemsList.innerHTML += showCartItems(item);
        });

        showAmountOfItemInCart();
    }
}

function showCartItems({id, image, name, price}) {
    let amountNum;
    amountArr.forEach(el => {
        if(parseInt(el[1]) === id){
            amountNum = el[0];
        }
    });
    
    return `<div class="added__item" data-item-id="${id}">
                    <div class="added__item-image">
                    <img src=${image} alt="furniture">
                </div>
                <div class="added__item-body">
                    <div class="added__item-title">${name}</div>
                    <div class="added__item-price">$${price}</div>
                    <button class="added__item-remove">remove</button>
                </div>
                <div class="added__item-counter">
                    <i class="fa-solid fa-angle-up angle"></i>
                    <div class="added__item-amount">${amountNum === undefined ? 1 : amountNum}</div>
                    <i class="fa-solid fa-angle-down angle"></i>
                </div>
            </div>`
}

// end of creating templates

// _________________END OF FUNCTIONS__________________






