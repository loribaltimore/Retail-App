let User = require('../models/userModel');
let crypto = require('crypto');
let { setSecurityPolicy } = require('./validators');
let randomHash = () => {
    return crypto.randomBytes(16).toString('hex');
}
module.exports.locals = async (req, res, next) => {
    let currentUser = await User.findById('62cade6087fd406e68edfcb2');
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.category = undefined;
    if (req.originalUrl !== '/') {
        res.locals.category = req.originalUrl.split('/')[2].split('');
        res.locals.category[0] = res.locals.category[0].toUpperCase();
        res.locals.category = res.locals.category.join('');
    };
    // if (req.session.prevUrl !== undefined) {
    //     res.locals.prevUrl = req.session.prevUrl
    // };
    res.locals.prevUrl = 5;
    res.locals.currentUrl = req.originalUrl;
    res.locals.currentUser = currentUser;

    if (req.session.cart !== undefined && req.session.cart.length) {
        let allItems = req.session.cart[0].items.map(function (element, index) {
            return {
                name: element.item.name,
                price: element.item.price,
                img: element.item.img[0].path,
                qty: element.qty,
                id: element.id
            }
        });
        res.locals.cart = {
            items: [].concat(allItems),
            subtotal: req.session.cart[0].subtotal,
            total: req.session.cart[0].total,
            tax: req.session.cart[0].tax
        }
    } else { res.locals.cart = [] };
    res.locals.allNotifs = currentUser.notifications;
    if (process.env.NODE_ENV !== 'production') {
        res.locals.isProduction = false  
    } else { res.locals.isProduction = true };
    next();
}

