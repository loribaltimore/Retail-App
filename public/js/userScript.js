let allStates =
    [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
    ];
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
let cartTotal = document.getElementById('cart-total');


let getEvent = (event) => {
    console.log(event.path)
    let input = document.getElementById(event.path[0].nextElementSibling.id);
    engagementForm.removeEventListener('click', getEvent);
    input.click();
    engagementForm.submit();
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
                element.childNodes[3].innerText = parseInt(element.childNodes[3].innerText) + 1;
                let itemCost = parseFloat(event.path[3].childNodes[1].childNodes[5].innerText.slice(1));
                cartTotal.innerText = `$${(((itemCost * parseFloat(tax_rate) + itemCost)) * parseInt(element.childNodes[3].innerText)).toString()
                    .match((/\d+\.\d\d/))[0]}`;
            } else if (event.target.innerText === '-') {
                if (element.childNodes[3].innerText !== '1') {
                    element.childNodes[3].innerText = parseInt(element.childNodes[3].innerText) - 1;
                    let itemCost = parseFloat(event.path[3].childNodes[1].childNodes[5].innerText.slice(1));
                    cartTotal.innerText = `$${(((itemCost * parseFloat(tax_rate) + itemCost)) * parseInt(element.childNodes[3].innerText)).toString()
                        .match((/\d+\.\d\d/))[0]}`;
                }
               
            }
        })
    });
};

if (updateCart) {
    updateCart.addEventListener('click', async (event) => {
        let test = undefined;
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
            url: `http://localhost:3001/shop/${currentUserId}/cart/qty`,
            data: {
                action: 'update-cart',
                cartItems: cartItemsObj,
                type: 'fetch'
            },
        }).then(data => {  }).catch(err => console.log(err));
        
    })
}


if (shoppingCart) {
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

///signup script
let notSameAsBillingBtn = document.getElementById('not-same-as-billing');
let sameAsBillingBtn = document.getElementById('same-as-billing');
let billingInput = document.getElementById('billing-input');
let falseSignupBtn = document.getElementById('false-signup-btn');
let mapp = document.getElementById('map');
let shippingAddress = document.getElementById('shipping-address');
let confirmAddress = document.getElementById('confirm-address');
let reenterAddress = document.getElementById('reenter-address');
let signupSubmit = document.getElementById('signup-submit-btn');
let phoneInput = document.getElementById('phone-input');

if (notSameAsBillingBtn) {
    let coord = undefined;
    notSameAsBillingBtn.addEventListener('click', (event) => {
        billingInput.hidden = false;
    });
    sameAsBillingBtn.addEventListener('click', (event) => {
        billingInput.hidden = true;
        console.log(event.target.checked)
    })
    falseSignupBtn.addEventListener('click', async (event) => {
        let street = document.getElementById('shipping-street');
        let state = document.getElementById('shipping-state');
        let zipcode = document.getElementById('shipping-zip');
        let address = `${street.value} ${state.value}, ${zipcode.value}`;
        if (allStates.indexOf(state.value) > -1) {
            let info = await axios({
                method: 'get',
                url: `http://localhost:3001/user/000/profile/locationData?address=${address}`,
            }).then(data => { console.log(data); return data }).catch(err => console.log(err));
            let { coordinates } = info.data;
            coord = coordinates;
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: coordinates, // starting position [lng, lat]
                zoom: 16, // starting zoom
                projection: 'globe' // display the map as a 3D globe
            });
            const marker = new mapboxgl.Marker({
                color: '#c4d4f3',
            }).setLngLat(coordinates).addTo(map)
            document.getElementById('map-container').hidden = false;
        } else {
            document.getElementById('map-container').hidden = true;
        }
    });

    if (confirmAddress) {
        confirmAddress.addEventListener('click', (event) => {
            document.getElementById('map-container').hidden = true;
            let geometry = document.getElementById('geometry-input');
            geometry.value = coord;
            if (sameAsBillingBtn.checked === true) {
                document.getElementById('billing-street').value = document.getElementById('shipping-street').value;
                document.getElementById('billing-state').value = document.getElementById('shipping-state').value;
        document.getElementById('billing-zip').value = document.getElementById('shipping-zip').value;
            };
            signupSubmit.click();
        });
        reenterAddress.addEventListener('click', (event) => {
            document.getElementById('map-container').hidden = true;
           document.getElementById('shipping-street').value = '';
            document.getElementById('shipping-state').value = '';
        document.getElementById('shipping-zip').value = '';
        })
    };


    phoneInput.addEventListener('keypress', (event) => {
        if (phoneInput.value.length === 3) {
            phoneInput.value = `(${phoneInput.value})`
        } else if (phoneInput.value.length === 8) {
            phoneInput.value = `${phoneInput.value} -`
        };
    });
}