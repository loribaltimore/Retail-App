let Item = require('../models/itemModel');
let User = require('../models/userModel');
let Review = require('../models/reviewModel');
let { ShoppingCartItem, newNotification, watchItem,
    likeItem, addToCart, changeQty, addReview } = require('../middleware/functions');

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
    console.log(currentItem)
          let allReviews = await currentItem.populate({ path: 'reviews.all_reviews' })
              .then(data => {
                  return data
              }).catch(err => console.log(err));
    let allReviewsLow = allReviews.reviews.all_reviews.slice();
    let allReviewsHigh = allReviews.reviews.all_reviews.slice().sort(function (a, b) {
        return b.rating - a.rating
  });
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
            await watchItem(req, currentUser, currentItem, itemId);
            break;
        case 'like':
            await likeItem(req, currentUser, currentItem, itemId);
            break;
        case 'add':
            await addToCart(req, currentUser, currentItem);
            break;
        case 'update-cart':
            await changeQty(req);
            break;
        case 'add-review':
            await addReview(req, currentUser, currentItem);
    };
    console.log(req.session.cart)
    await currentUser.save();
    await currentItem.save();
res.redirect(res.locals.currentUrl)
}













