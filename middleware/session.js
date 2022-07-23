let mongoose = require('mongoose');
let Schema = mongoose.Schemal
let model = mongoose.model;
let User = require('../models/userModel');
let Item = require('../models/itemModel');
let {ShoppingCart} = require('../middleware/functions')

let interest_engagement = async (req, res, next) => {
    let { userId, itemId } = req.params;
    console.log('updating database');
    let currentUser = await User.findById(userId);
    for (let itemId in req.session.userInterested) {
        let currentItem = await Item.findById(itemId);
        let category = currentItem.category.main;
        console.log(`current Items total interest from ${currentItem.user_engagement.total_interest}`);
        currentItem.user_engagement.total_interest += req.session.userInterested[itemId].main;
            console.log(`to ${currentItem.user_engagement.total_interest}`);
    console.log(`Users interest in ${category} BEFORE ${currentUser.history.interest_by_category[category]}`)

        currentUser.history.interest_by_category[category].main += req.session.userInterested[itemId].main;
       
        for (let cat in req.session.userInterested[itemId].sub) {
            let specificValue = Object.keys(req.session.userInterested[itemId].sub[cat]);
            currentUser.history.interest_by_category[category].sub[cat][specificValue] += req.session.userInterested[itemId].sub[cat][specificValue];
        }
        console.log(`Users interest in ${category} AFTER ${currentUser.history.interest_by_category[category]}`);
    await currentItem.save();
    };
    await currentUser.save();
};


module.exports.session = async (req, res, next) => {
    if (req.session.cart === undefined) {
        req.session.cart = [];
    } else {};
    req.session.prevUrl = req.session.currentUrl;
    req.session.currentUrl = req.originalUrl;
    if (req.session.prevUrl !== req.session.currentUrl
    && req.session.userInterested) {
        let interest = await interest_engagement(req)
        .then(data => { return data })
        .catch(err => console.log(err));
    };
    next();
}
