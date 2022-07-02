let Item = require('../models/itemModel');
let User = require('../models/userModel');
let Review = require('../models/reviewModel');
let { ShoppingCartItem, newNotification, watchItem,
    userEngage, userDisengage, addReview } = require('../middleware/functions');

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
    let { itemId, userId } = req.params;
    let currentUser = await User.findById(userId);
    let currentItem = await Item.findById(itemId);
          let allReviews = await currentItem.populate({ path: 'reviews.all_reviews' })
              .then(data => {
                  return data
              }).catch(err => console.log(err));
    let allReviewsLow = allReviews.reviews.all_reviews.slice();
    let allReviewsHigh = allReviews.reviews.all_reviews.slice().sort(function (a, b) {
        return b.rating - a.rating
    });
   
    
    console.log(req.session.cart.map(x => x.item._id))
    
        return res.render('itemPage', {currentItem, allReviewsHigh, allReviewsLow})
}

module.exports.itemEngagement = async (req, res, next) => {
    let { itemId, category, userId } = req.params;
    let currentUser = await User.findById(userId);
    let currentItem = await Item.findById(itemId);
    if (req.body.engage) {
        await userEngage(req, currentUser, currentItem, itemId);
    } else {
        await userDisengage(req, currentUser, currentItem, itemId);
    };
    await currentUser.save();
    await currentItem.save();
res.redirect(res.locals.currentUrl)
}













