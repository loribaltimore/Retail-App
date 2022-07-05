let Item = require('../models/itemModel');
let Review = require('../models/reviewModel');

class ShoppingCartItem{
    constructor(item, qty, sort) {
        this.item = item;
        this.qty = qty;
        this.sort = 0;
    }
    removeItem(req) {
        this.sort = 1;
        req.session.cart.sort((a, b) => a - b).pop();
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

let addToCart = async (req, currentUser, currentItem) => {
    let newCartItem = new ShoppingCartItem(currentItem, 1);
    if (!req.session.cart) {
        req.session.cart = [].concat(newCartItem);
    } else {
        req.session.cart.push(newCartItem);
    }
    currentItem.user_engagement.total_interest += 1
    currentUser.history.interest_by_category[currentItem.category.main] += 1;
    req.flash('success', 'Successfully added to cart')
};
let removeFromCart = async (req, currentUser, currentItem) => {
    req.session.cart.pull(newCartItem);
    req.flash('info', 'Successfully added to cart')
};

let changeQty = async (req) => {
    let { cartItems } = req.body;
    req.session.cart.forEach(function (element, index) {
        if (typeof cartItems !== 'string') {
            let cartItemNames = cartItems.map(x => x.item);
            if (cartItemNames.indexOf(element.item.name) >= 0) {
                element.qty = parseInt(cartItems[cartItemNames.indexOf(element.item.name)].qty);
            }
        } else {
            cartItems = cartItems.split('::');
            if (cartItems[0] === element.item.name) {
                element.qty = parseInt(element.qty) + 1;
            }
        }
    });
};


let userEngage = async (req, currentUser, currentItem, itemId) => {
    let { action } = req.body.engage;
    switch (action) {
        case 'watch':
            await watchItem(req, currentUser, currentItem, itemId);
            break;
        case 'like':
            await likeItem(req, currentUser, currentItem, itemId);
            break;
        case 'add':
            await removeFromCart(req, currentUser, currentItem);
            break;
        case 'update-cart':
            await changeQty(req);
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
        case 'add':
            await removeFromCart(req, currentUser, currentItem);
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
    let { reviewId } = req.params;
    let { review_body, rating } = req.body.review;
    console.log(review_body, rating);
    let review = await Review.findById(reviewId);
    console.log(review)
    let currentReview = await Review.findByIdAndUpdate(reviewId, { body: review_body, rating: rating }, {new: true} )
        .then(data => console.log(data)).catch(err => console.log(err));
    req.flash('success', 'Review Successfully Updated!');
}

module.exports = {
    ShoppingCartItem, notifyPriceChange, Notification,
    newNotification, userEngage, userDisengage,
    addReview, deleteReview, editReview
};
