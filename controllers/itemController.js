let Item = require('../models/itemModel');
let User = require('../models/userModel');
let Review = require('../models/reviewModel');
let { ShoppingCartItem, newNotification, filter } = require('../middleware/functions');

module.exports.renderCategory = async (req, res, next) => {
    let itemCategory = req.originalUrl.split('/')[3];
    let allItems = await Item.find({ 'category.main': itemCategory });
    console.log(allItems.filter(x => x.reviews.all_reviews.length !== []))
    let topItems = allItems
        .sort(function (a, b) { return b.reviews.avg - a.reviews.avg })
        .slice(0, 8);
    res.render('categoryPage', { topItems, allItems })
}

module.exports.renderItem = async (req, res, next) => {
    let { itemId } = req.params;
    let currentItem = await Item.findById(itemId);
          let allReviews = await currentItem.populate({ path: 'reviews.all_reviews' })
              .then(data => {
                  return data.reviews.all_reviews
              }).catch(err => console.log(err));
    let allReviewsLow = allReviews.sort(function (a, b) {
        return a.rating - b.rating
    });
    let allReviewsHigh = allReviews.sort(function (a, b) {
        return b.rating - a.rating
    });
    console.log(allReviewsLow)
    console.log(allReviewsHigh)
//     console.log(allReviews)
//     console.log(allReviewsHigh);
// console.log(allReviewsLow)
        return res.render('itemPage', {currentItem, allReviewsHigh, allReviewsLow})
}

module.exports.itemEngagement = async (req, res, next) => {
    let { itemId, category, userId } = req.params;
    let { action } = req.body;
    console.log(req.body);
    let currentUser = await User.findById(userId);
    let currentItem = await Item.findById(itemId);
    switch (action) {
        case 'watch':
            currentUser.history.watching.push(itemId);
            currentItem.user_engagement.total_interest += 1;
            currentItem.user_engagement.watched_by.push(currentUser.id);
            currentUser.history.interest_by_category[currentItem.category.main] += 1;
            req.flash('success', `Now watching ${currentItem.name}`)
            break;
        case 'like':
            currentUser.history.liked.push(itemId);
            currentItem.user_engagement.total_interest += 1;
            currentItem.user_engagement.liked_by.push(currentUser.id);
            currentUser.history.interest_by_category[currentItem.category.main] += 1;
            req.flash('success', `You liked ${currentItem.name}`)
            break;
        case 'add':
            let newCartItem = new ShoppingCartItem(currentItem, 1);
            if (!req.session.cart) {
                req.session.cart = [].concat(newCartItem);
            } else {
                req.session.cart.push(newCartItem);
            }
            currentItem.user_engagement.total_interest += 1
            currentUser.history.interest_by_category[currentItem.category.main] += 1;
            req.flash('success', 'Successfully added to cart')
            break;
        case 'update-cart':
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
    console.log(req.session.cart)
    await currentUser.save();
    await currentItem.save();
res.redirect(res.locals.currentUrl)
}


///WHY IN GODS NAME ARE THE REVIEWS NOT SORTING
///FINISH THE REVIEWS THIS FEELS LIKE A GIANT WASTE OF TIME AND IS IRRITATING
///BUT YOU HAD A SOLUTION A LONG TIME AGO AND WANTED TO TRY TO FIGURE OUT SOMETHING MORE 
///ELOQUENT. THATS HOW YOU LEARN. GROWTH IS HARD. IF YOU JUST DID YOUR FIRST IDEA YOU WOULDNT HAVE BEEN
///ACTIVELY ENGAGED IN FIGURING OUT NEW SOLUTIONS 












