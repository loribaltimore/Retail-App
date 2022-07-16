let Item = require('../models/itemModel');
let Review = require('../models/reviewModel');
let mongoose = require('mongoose');
let baseClient = require('@mapbox/mapbox-sdk/services/geocoding');
const { transformAuthInfo } = require('passport');
let geocoder = baseClient({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

let removeItem = function (req) {
    console.log(req.session.cart[0].items.length)
    this.sort = 1;
    req.session.cart.sort((a, b) => a - b).pop();
};

let getTotal = function (req, res, shoppingCart) {
    if (shoppingCart.items && shoppingCart.items.length) {
        shoppingCart.subtotal = shoppingCart.items.map(function (element, index) {
            return element.item.price * element.qty
        }).reduce((a, b) => a + b);
    } else {shoppingCart.subtotal = 0.00}
    shoppingCart.total = shoppingCart.subtotal + parseFloat((shoppingCart.subtotal * shoppingCart.tax)
        .toString().slice(0, 4));
    res.locals.cart.subtotal = shoppingCart.subtotal;
    res.locals.cart.total = shoppingCart.total;
    return shoppingCart.total;
};

class ShoppingCart{
    constructor(items, subtotal, total, tax) {
        this.items = [];
        this.subtotal = 0;
        this.total = 0; 
        this.tax = (tax*0.01);
    }
}


class ShoppingCartItem{
    constructor(item, qty, sort) {
        this.item = item;
        this.qty = qty;
        this.sort = 0;
        this.id = mongoose.Types.ObjectId();
        this.remove = removeItem;
    }
    
    changeQty(req, num) {
        this.qty += num;
        if ((this.qty += num) <= 0) {
            this.removeItem(req);
        }
    }
};



class Notification{
    constructor(message, category, item, sort) {
        this.message = message;
        this.category = category;
        this.item = item;
        this.sort = 0
    }
    async removeNotification(currentUser) {
        currentUser.notifications.pull({ message: this.message });
        await currentUser.save();
    }
    
}

const newNotification = async (currentUser, currentItem, category) => {
    let message = undefined;
    let item = {
        item_id: currentItem.id,
        item_img: currentItem.img[0].path,
        item_price: currentItem.price,
        item_category: currentItem.category.main
    };
    switch (category) {
        case 'sale':
            message = `${currentItem.name} is on sale!`
            break;
        case 'recommended':
            message = `Recommended Item: ${currentItem.name}`
            break;
        case 'profile':
            message = 'Action needed in user profile..'
            break;
    }
    let newNotification = new Notification(message, category, item);
    currentUser.notifications.push(newNotification);
    await currentUser.save();
    console.log('newNotification is working')
}

const notifyPriceChange = async (currentItem, currentUser) => {
    console.log('notify price change working')
    let allWatchingUsers = await currentItem.populate({ path: 'user_engagement.watched_by' })
        .then(data => { return data.user_engagement.watched_by }).catch(err => console.log(err));
    allWatchingUsers.forEach(async (element, index) => {
        await newNotification(element, currentItem, 'sale')
            .then(data => { return data })
            .catch(err => console.log(err));
    });
};

let watchItem = async (req, currentUser, currentItem, itemId) => {
    currentUser.history.watching.push(itemId);
    currentItem.user_engagement.total_interest += 1;
    currentItem.user_engagement.watched_by.push(currentUser.id);
    currentUser.history.interest_by_category[currentItem.category.main] += 1;
    req.flash('success', `Now watching ${currentItem.name}`)
};

let unwatchItem = async (req, currentUser, currentItem) => {
    currentUser.history.watching.pull(currentItem);
    currentItem.user_engagement.watched_by.pull(currentUser._id);
    req.flash('info', `Not watching ${currentItem.name} anymore`)
};

let likeItem = async (req, currentUser, currentItem, itemId) => {
    currentUser.history.liked.push(itemId);
    currentItem.user_engagement.total_interest += 1;
    currentItem.user_engagement.liked_by.push(currentUser.id);
    currentUser.history.interest_by_category[currentItem.category.main] += 1;
    req.flash('success', `You liked ${currentItem.name}`)
};
let unlikeItem = async (req, currentUser, currentItem, itemId) => {
    currentUser.history.liked.pull(itemId);
    currentItem.user_engagement.liked_by.pull(currentUser.id);
    req.flash('info', `You un-liked ${currentItem.name}`)
};

let addToCart = async (req, res, currentUser, currentItem) => {
    let newCartItem = new ShoppingCartItem(currentItem, 1);
    if (req.session.cart === undefined || req.session.cart.length === 0) {
        let newCart = new ShoppingCart([], 0, 0, currentUser.bio.address.sales_tax);
        req.session.cart = [].concat(newCart);
        req.session.cart[0].items.push(newCartItem);
        getTotal(req, res, req.session.cart[0]);
    } else {
        req.session.cart[0].items.push(newCartItem);
        getTotal(req, res, req.session.cart[0]);
    }
    currentItem.user_engagement.total_interest += 1
    currentUser.history.interest_by_category[currentItem.category.main].main += 1;
    console.log(req.session.cart[0]);
    req.flash('success', 'Successfully added to cart')
};
let removeFromCart = async (req, res, currentItem) => {
    let { cart_item_id } = req.body;
    req.session.cart[0].items.forEach(function (element, index) {
        if (element.id === cart_item_id) {
            element.sort = 1;
            req.session.cart[0].items.pop();
            }
    });
    getTotal(req, res, req.session.cart[0]);
    console.log(req.session.cart[0])
    req.flash('info', 'Successfully removed from cart');
   return res.redirect(req.session.prevUrl);
};

let changeQty = async (req, res, next) => {
    let { cartItems, type } = req.body;
    console.log('its working')
    let newTotal = undefined;
    let updatedQtyBy = 1;
    let originalQty = req.session.cart[0].items[0].qty;
    req.session.cart[0].items.forEach(function (element, index) {
        if (typeof cartItems !== 'string') {
            let cartItemNames = cartItems.map(x => x.item);
            if (cartItemNames.indexOf(element.item.name) >= 0) {
                element.qty = parseInt(cartItems[cartItemNames.indexOf(element.item.name)].qty);
                updatedQtyBy = element.qty - originalQty;
               newTotal = getTotal(req, res, req.session.cart[0]);
            }
        } else {
            cartItemsArr = cartItems.split('::');
            if (cartItemsArr[0] === element.item.name) {
                element.qty = parseInt(element.qty) + 1;
               newTotal = getTotal(req, res, req.session.cart[0]);
            }
        }
    });
    console.log(req.session.cart[0]);

    if (type === 'fetch') {
       return res.send({ total: newTotal, updatedBy: updatedQtyBy });
    };
};


let userEngage = async (req, res, next, currentUser, currentItem, itemId) => {
    let { action } = req.body.engage;
    switch (action) {
        case 'watch':
            await watchItem(req, currentUser, currentItem, itemId);
            break;
        case 'like':
            await likeItem(req, currentUser, currentItem, itemId);
            break;
        case 'add':
            await addToCart(req, res, currentUser, currentItem);
            break;
            case 'update-cart':
                await changeQty(req, res, next);
            break;  
    };
};

let userDisengage = async (req, currentUser, currentItem, itemId) => {
    let { action} = req.body.disengage;
    switch (action) {
        case 'watch':
            await unwatchItem(req, currentUser, currentItem, itemId);
            break;
        case 'like':
            await unlikeItem(req, currentUser, currentItem, itemId);
            break;
           
    };
}

let addReview = async (req, currentUser, currentItem) => {
    let { review_body, rating } = req.body.review;
    let newReview = await new Review({
        item: currentItem._id,
        author: {
            name: currentUser.bio.name,
            userId: currentUser._id
        },
        body: review_body,
        rating: rating
    }).save()
        .then(data => { return data })
        .catch(err => console.log(err));
    currentUser.history.reviews.push(newReview._id);
    currentItem.reviews.all_reviews.push(newReview._id);
    currentItem.reviews.qty += 1;
    currentItem.reviews.total_rating += parseInt(rating);
};
let deleteReview = async (req, currentUser, currentItem) => {
    let { reviewId } = req.params;
    let currentReview = await Review.findByIdAndDelete(reviewId)
        .then(data => { return data }).catch(err => console.log(err));
    currentUser.history.reviews.pull(currentReview._id);
    currentItem.reviews.all_reviews.pull(currentReview._id);
    currentItem.reviews.qty -= 1;
    currentItem.reviews.total_rating -= parseInt(currentReview.rating);
    req.flash('success', 'Successfully Deleted Review!');
};

let editReview = async (req, res, next) => {
    let { reviewId, itemId } = req.params;
    let { review_body, rating } = req.body.review;
    console.log(review_body, rating);
    let review = await Review.findById(reviewId);
    console.log(review)
    let currentItem = await Item.findById(itemId);
    console.log(currentItem.reviews.total_rating);
    currentItem.reviews.total_rating = (currentItem.reviews.total_rating - review.rating) + parseInt(rating);
    let currentReview = await Review.findByIdAndUpdate(reviewId, { body: review_body, rating: rating }, {new: true} )
        .then(data => console.log(data)).catch(err => console.log(err));
    await currentItem.save();
    req.flash('success', 'Review Successfully Updated!');
}

let fetchLocationData = async (req, res, next) => {
    let { address } = req.query;
    let info = await geocoder.forwardGeocode({
        query: address,
        limit: 1
    }).send()
        .then(data => { return data.body.features[0].geometry }).catch(err => console.log(err));
    return res.send(info)
}

module.exports = {
    ShoppingCartItem, notifyPriceChange, Notification,
    newNotification, userEngage, userDisengage,
    addReview, deleteReview, editReview, fetchLocationData, ShoppingCart,
    changeQty, removeFromCart
};
