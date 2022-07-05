let Item = require('../models/itemModel');
let User = require('../models/userModel');
let Review = require('../models/reviewModel');
let { ShoppingCartItem, newNotification, userEngage,
    userDisengage, addReview, deleteReview, editReview } = require('../middleware/functions');

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
    let currentReview = undefined;
          let allItemReviews = await currentItem.populate({ path: 'reviews.all_reviews' })
              .then(data => {
                  return data
              }).catch(err => console.log(err));
    let allReviewsLow = allItemReviews.reviews.all_reviews.slice();
    let allReviewsHigh = allItemReviews.reviews.all_reviews.slice().sort(function (a, b) {
        return b.rating - a.rating
    });
    if (allItemReviews.reviews.all_reviews.map(x => x.author.userId.toString()).indexOf(currentUser.id) >= 0) {
        currentReview = allReviewsHigh.filter(x => x.author.userId.toString() === currentUser.id)[0];
    };
    return res.render('itemPage', { currentItem, allReviewsHigh, allReviewsLow, currentReview });
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
};

module.exports.itemReview = async (req, res, next) => {
    let { userId, itemId } = req.params;
    let { method } = req;
    let currentUser = await User.findById(userId);
    let currentItem = await Item.findById(itemId);
    switch (method) {
        case 'POST':
            await addReview(req, currentUser, currentItem);
            break;
        case 'DELETE':
            await deleteReview(req, currentUser, currentItem);
            break;
        case 'PUT':
            await editReview(req, currentUser, currentItem);
            break;
    };
    await currentUser.save();
    await currentItem.save();
    res.redirect(`/shop/${currentUser.id}/${currentItem.category.main}/${currentItem.id}`);
}

///finish with reviews. Want to display Users review on review page and give option to edit review.
//only one review per user so must be a put request.
///change deleteReview in functions to edit review and change functionality.
///ensure all item disengagement functions work












