let mongoose = require('mongoose');
let Schema = mongoose.Schemal
let model = mongoose.model;
let User = require('../models/userModel');
let Item = require('../models/itemModel');
let {ShoppingCart} = require('../middleware/functions')

let interest_engagement = async (req, res, next) => {
    let itemUrl = /shop\/\w+\/\D+\/\w+/;
    let { userId, itemId } = req.params;
    let currentItemId = undefined;
    let startTime = undefined;
    let startingUrl = undefined;
    if (req.session.startingUrl === undefined
        && itemUrl.test(req.originalUrl) === true) {
        currentItemId = itemId;
        startingUrl = req.originalUrl;
        startTime = Date.now();
        console.log(`New Starting Url added to session @ ${startTime}`)
    } else {
        if (req.originalUrl !== req.session.startingUrl
        && req.params.category !== 'profile') {
            console.log('also here')
            let { currentItemId } = req.session;
            let currentUser = await User.findById(userId);
            let currentItem = await Item.findById(currentItemId);
            let endTime = Date.now();
            let totalTime = endTime - req.session.startTime;
            if ((totalTime / 1000) > 54) {
                console.log(`current items total interest changed from ${currentItem.user_engagement.total_interest}`)
                currentItem.user_engagement.total_interest += Math.floor((totalTime / 1000) / 54);
                console.log(`to ${currentItem.user_engagement.total_interest}`);
                console.log(`current users interest in ${currentItem.category.main} from ${currentUser.history.interest_by_category[currentItem.category.main]}`);
                currentUser.history.interest_by_category[currentItem.category.main] += Math.floor((totalTime / 1000) / 54);
                console.log(`to ${currentUser.history.interest_by_category[currentItem.category.main]}`)
                await currentItem.save();
                await currentUser.save();
            } else { console.log('User did not stay on page long enough to gauge interest via user session') };
            if (itemUrl.test(req.originalUrl) === true) {
                startingUrl = req.originalUrl;
                startTime = Date.now();
                currentItemId = itemId;
            } else {
                 startingUrl = undefined;
                startTime = undefined;
                currentItemId = undefined;
            };
        }
    }
    return { startTime, startingUrl, currentItemId }
};

module.exports.session = async (req, res, next) => {
    if (req.session.cart === undefined) {
        req.session.cart = [];
    } else {console.log(req.session.cart[0] instanceof ShoppingCart)};
    req.session.prevUrl = req.session.currentUrl;
    req.session.currentUrl = req.originalUrl;
    let interest = await interest_engagement(req)
        .then(data => { return data })
        .catch(err => console.log(err));
    req.session.startTime = interest.startTime;
    req.session.startingUrl = interest.startingUrl;
    req.session.currentItemId = interest.currentItemId;
    next();
}
