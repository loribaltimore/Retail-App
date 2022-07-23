let Item = require('../models/itemModel');
let mongoose = require('mongoose');
const User = require('../models/userModel');
const { notifyPriceChange, removeFromCart,
    changeQty, getRecommended } = require('../middleware/functions');
const { session } = require('../middleware/session');
let { salesTaxByState, states } = require('../models/seeds/sales_tax');

module.exports.renderHome = async (req, res, next) => {
    let currentUser = await User.findById('62cade6087fd406e68edfcb2');
    let recommended = await getRecommended(req, res, next)
        .then(data => { return data })
        .catch(err => console.log(err));
    res.render('home', { currentUser, recommended });
};

module.exports.renderCreateItem = async (req, res, next) => {
    res.render('createItem')
};

module.exports.createItem = async (req, res, next) => {
    let { id, category } = req.params;
    let images = req.files.map(function (element, index) {
        return { path: element.path, filename: element.filename }
    });
    let { name, description, price, cat } = req.body;
    let newItem = await new Item({
        name: name,
        description: description,
        price: price,
        category: {
            catId: mongoose.Types.ObjectId(),
            main: cat.main,
            sub: cat.sub
        },
        img: images
    }).save().then(data => {return data}).catch(err => console.log(err));
    console.log(newItem)
    req.flash(`success', 'Successfully added ${newItem.name}`);
    res.redirect(`${newItem.id}`);
}

module.exports.deleteItem = async (req, res, next) => {
    let { id } = req.params;
    await Item.findByIdAndDelete(id)
        .then(data => console.log(data))
        .catch(err => console.log(err));
    req.flash('success', 'Successfully Deleted!');
    res.redirect('/create')
}


module.exports.updateItem = async (req, res, next) => {
    let isPriceLess = undefined;
    let { itemId } = req.params;
    let { name, price, description, cat, img } = req.body;
    let { sub, main } = cat;
    let newImg = req.files.map(function (element, index) {
        return { path: element.path, filename: element.filename }
    });
    let currentItem = await Item.findByIdAndUpdate(itemId, { name, price, description, cat })
        .then(data => { isPriceLess = data.price; return data })
        .catch(err => console.log(err));
    if (img) {
        currentItem.img = currentItem.img.filter(function (element, index) {
            if (img.indexOf(element.filename) === -1) {
                return element
            }
        })
    };
    currentItem.img.concat(newImg);

    if (currentItem.price > price) {
        console.log('getting in here')
        await notifyPriceChange(currentItem).then(data => console.log(data)).catch(err => console.log(err));
    };
    await currentItem.save();
    req.flash('success', 'Successfully Updated Listing');
    res.redirect(`${currentItem.id}`)
}

///create async utility for errorHandling
///try to start on a recommendation algorithm
///seed your database and user history with categories

////Maybe I should make a review router
///reviews filter not working properly
///possibly make 'notifypricechange' more general so it can give ANY notification pushed to it
///rather than just notify price change!
///recommended on home page based on categories, subcategories
///expand on notifications by making sure other scenarios than just price change work
///notification popup needs to be finished. closing and deleting notification (enable currentItem save())


module.exports.renderAllItems = async (req, res, next) => {
    let { userId } = req.params;
    let currentUser = await User.findById(userId);
    let currentUserAllItemsPop = await currentUser.populate({ path: 'history.created' })
        .then(data => { return data })
        .catch(err => console.log(err));
    let allItems = currentUserAllItemsPop.history.created;
    res.render('allUserItems', { allItems });
};

module.exports.deleteNotifications = async (req, res, next) => {
    let { userId, notifId } = req.params;
    let currentUser = await User.findById(userId);
    let currentNotif = currentUser.notifications.filter(x => x.id.toString() === notifId)[0];
   return `/shop/${userId}/${currentNotif.item.item_category}/${currentNotif.item.item_id.toString()}`
}

module.exports.renderSignup = async (req, res, next) => {
    res.render('signup');
}

module.exports.createUser = async (req, res, next) => {
    let { name, email, address, phone } = req.body.bio;
    let { shipping, billing } = address;
    let geo = req.body.bio.address.geometry.split(',').map(x => parseFloat(x));
    let phoneModified = phone.match(/[0-9]/g).join('');
    let salesTax = salesTaxByState[states.indexOf(shipping.state)];
    console.log(salesTax)
    let newUser = await new User({
        bio: {
            name,
            email,
            address: {
                shipping,
                billing,
                geometry: { type: 'Point', coordinates: geo },
                sales_tax: salesTax.rate
            },
            phone: phoneModified
        }
    });
    console.log(newUser.bio.address)
}

module.exports.userCart = async (req, res, next) => {
    let { action } = req.body;
    switch (action) {
        case 'update-cart':
            await changeQty(req, res, next);
            break;
        case 'cart-remove':
            await removeFromCart(req, res);
            break;
    }
};

module.exports.callSession = async (req, res, next) => {
    let { userInterested, shouldUpdate } = req.body;
    let { itemId } = req.params;
    ///Setting initial value @ .2 instead of .1 to take the initial choosing of the item into account
    ///We have .1 for clicking the item, then another once interest is demonstrated;
    console.log('call session working');
    if (userInterested) {
        let currentItemSubs = await Item.findById(itemId).then(data => { return data.category.sub });
        if (req.session.userInterested === undefined) {
             console.log('in here')
            req.session.userInterested = {};
            req.session.userInterested[itemId] = {main: .2, sub: {}};
            for (let cat of currentItemSubs) {
                req.session.userInterested[itemId].sub[cat] = .2
            };
        } else if (Object.keys(req.session.userInterested).indexOf(itemId) === -1) {
            console.log('SHOULDNT BE HERE')
            req.session.userInterested[itemId].main = .2
            for (let cat of currentItemSubs) {
                req.session.userInterested[itemId].sub[cat] = .2
            };
        } else {
            req.session.userInterested[itemId].main += .1;
            for (let cat of currentItemSubs) {
                req.session.userInterested[itemId].sub[cat] += .1
            };
        };
    } else if (shouldUpdate) {
        session(req, res, next);
    };
   return res.send('working')
}
