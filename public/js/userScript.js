
let deletePopup = document.getElementById('delete-item-popup');
let deleteListingBtn = document.getElementById('delete-listing-btn');
let keepItem = document.getElementById('keep-item');
let updateListingBtn = document.getElementById('update-listing-btn');
let updatePopup = document.getElementById('update-popup-div');
let updateRadio = document.querySelectorAll('.update-item-radio');
let updateCheckbox = document.querySelectorAll('.update-item-checkbox');
let cancelUpdate = document.getElementById('cancel-update-btn');
let notifBtn = document.getElementById('notif-btn');
let notifCount = document.getElementById('notif-count');

if (deleteListingBtn) {
    deleteListingBtn.addEventListener('click', (event) => {
        console.log('sparky')
        deletePopup.removeAttribute('hidden');
    });
    keepItem.addEventListener('click', (event) => {
        deletePopup.setAttribute('hidden', true);
    });
};

if (updateListingBtn) {
    updateListingBtn.addEventListener('click', (event) => {
        updatePopup.removeAttribute('hidden');
    });

    if (updateRadio) {
        updateRadio.forEach(function (element, index) {
            if (categoryMain === element.value) {
                element.checked = true;
            }
        });
        updateCheckbox.forEach(function (element, index) {
            if (categorySub.indexOf(element.value) >= 0) {
                element.checked = true;
            }
        });
        cancelUpdate.addEventListener('click', (event) => {
            updatePopup.setAttribute('hidden', true);
        })
    }
};

if (notifCount) {
    notifBtn.addEventListener('click', (event) => {
        let notifs = document.getElementById('notifs');
        notifs.hidden = false; 
    })
    notifs.addEventListener('click', async (event) => {
        console.log('awdadfsd')
        if (event.target.classList.contains('notification') === true) {
            console.log('getting here')
        await axios({
                method: 'post',
                url: `http://localhost:3001/user/${currentUserId}/notifications/${event.target.id}`,
              data: {}
        }).then(response => {return response })
            .catch(err => console.log(err));
        }
    })
}

/////Start of shop script
let engagementBtns = document.querySelectorAll('.eng-btn')
let engagementInputs = document.querySelectorAll('.eng-input');
let engagementForm = document.getElementById('eng-form');
let shoppingCartBtn = document.getElementById('shopping-cart-btn');
let qtyNumDiv = document.querySelectorAll('.qty-num');
let updateCart = document.getElementById('shopping-cart-close-btn');
let cartItems = document.querySelectorAll('.cart-item');
let shoppingCart = document.getElementById('shopping-cart');
let allReviewsHigh = document.getElementById('all-reviews-high');
let allReviewsLow = document.getElementById('all-reviews-low');
let filterHighBtn = document.getElementById('high');
let filterLowBtn = document.getElementById('low');

let getEvent = (event) => {
    console.log(event.path)
    let input = document.getElementById(event.path[0].nextElementSibling.id);
    engagementForm.removeEventListener('click', getEvent);
    input.click();
    engagementForm.submit();
    console.log('should be working')
}

if (engagementForm) {
    engagementForm.addEventListener('click', getEvent);
    shoppingCartBtn.addEventListener('click', (event) => {
        shoppingCartBtn.removeAttribute('hidden');
    });
}
if (qtyNumDiv) {
    qtyNumDiv.forEach(function (element, index) {
        element.addEventListener('click', (event) => {
            if (event.target.innerText === '+') {
                element.childNodes[3].innerText = parseInt(element.childNodes[3].innerText) + 1
            } else if (event.target.innerText === '-'
                && element.childNodes[3].innerText !== '0') {
                element.childNodes[3].innerText = parseInt(element.childNodes[3].innerText) - 1
            }
        })
    });
};

if (updateCart) {
    updateCart.addEventListener('click', async (event) => {
        let cartItemsObj = [];
       cartItems.forEach(function (element, index) {
            cartItemsObj.push({
                item: element.childNodes[1].childNodes[1].innerText,
                qty: element.childNodes[3].childNodes[3].childNodes[3].innerText
            }) 
       });
        shoppingCart.hidden = true;
       await axios({
            method: 'post',
            url: `http://localhost:3001/shop/${currentUserId}/${itemCategory}/${currentItemId}`,
            data: {
                engage: {
                    action: 'update-cart'
                },
                cartItems: cartItemsObj
            },
        }).then(data => console.log(data)).catch(err => console.log(err))
    })
}


if (shoppingCartBtn) {
    shoppingCartBtn.addEventListener('click', (event) => {
        if (shoppingCart.hidden === true) {
            shoppingCart.hidden = false
        } else {
            shoppingCart.hidden = true
        }
    })
};

if (filterHighBtn) {
    filterHighBtn.addEventListener('click', (event) => {
        if (allReviewsHigh.hidden === true) {
            allReviewsHigh.hidden = false;
            allReviewsLow.hidden  = true
        } else {
            allReviewsHigh.hidden = true
            allReviewsLow.hidden = false
        }
    });
    filterLowBtn.addEventListener('click', (event) => {
        if (allReviewsLow.hidden === true) {
            allReviewsLow.hidden = false;
            allReviewsHigh.hidden = true;
        } else {
            allReviewsLow.hidden = true;
            allReviewsHigh.hidden = false
        }
    })
}

///REVIEW SCRIPT
let editForm = document.getElementById('review-edit-form');
let editDecoy = document.getElementById('edit-review-decoy');
let editReviewBtn = document.getElementById('edit-review-btn');

if (editDecoy) {
    editDecoy.addEventListener('click', (event) => {
        editDecoy.hidden = true;
        editForm.hidden = false;
    })
}