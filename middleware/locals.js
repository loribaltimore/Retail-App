let User = require('../models/userModel');

module.exports.locals = async (req, res, next) => {
    let currentUser = await User.findById('62ae1b99a87bbbb9c2f64184');
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.info = req.flash('info');
    res.locals.category = req.originalUrl.split('/')[2].split('');
    res.locals.category[0] = res.locals.category[0].toUpperCase();
    res.locals.category = res.locals.category.join('');
    // if (req.session.prevUrl !== undefined) {
    //     res.locals.prevUrl = req.session.prevUrl
    // };
    res.locals.prevUrl = 5;
    res.locals.currentUrl = req.originalUrl;
    res.locals.currentUser = currentUser;
    if (req.session.cart) {
        res.locals.cart = req.session.cart.map(function (element, index) {
            return {
                name: element.item.name,
                price: element.item.price,
                img: element.item.img[0].path,
                qty: element.qty
            }
        });
    } else { res.locals.cart = [] };
    res.locals.allNotifs = currentUser.notifications;
    next();
}

