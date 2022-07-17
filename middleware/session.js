let mongoose = require('mongoose');
let Schema = mongoose.Schemal
let model = mongoose.model;
let User = require('../models/userModel');
let Item = require('../models/itemModel');
let {ShoppingCart} = require('../middleware/functions')

let interest_engagement = async (req, res, next) => {
    let { userId, itemId } = req.params;
    let currentUser = await User.findById(userId);
    let currentItem = await Item.findById(itemId);
    let category = currentItem.category.main;
    console.log(`current Items total interest from ${currentItem.user_engagement.total_interest}`);
    currentItem.user_engagement.total_interest += .1;
    console.log(`to ${currentItem.user_engagement.total_interest}`);
    console.log(`Users interest in ${category} BEFORE ${currentUser.history.interest_by_category[category]}`)
    currentUser.history.interest_by_category[category].main += .1;
    for (let cat of currentItem.category.sub) {
        currentUser.history.interest_by_category[category].sub[cat] += .1
    };
    console.log(`Users interest in ${category} AFTER ${currentUser.history.interest_by_category[category]}`)
    await currentUser.save();
    await currentItem.save();
}

module.exports.session = async (req, res, next) => {
    let { userInterested } = req.body;
    if (req.session.cart === undefined) {
        req.session.cart = [];
    } else {};
    req.session.prevUrl = req.session.currentUrl;
    req.session.currentUrl = req.originalUrl;
    if (userInterested) {
        let interest = await interest_engagement(req)
        .then(data => { return data })
        .catch(err => console.log(err));
    }
    next();

  
}
