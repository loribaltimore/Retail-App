let Item = require('../models/itemModel');
let mongoose = require('mongoose');
const User = require('../models/userModel');
const { notifyPriceChange } = require('../middleware/functions');

module.exports.renderHome = async (req, res, next) => {
    let currentUser = await User.findById('62ae1b99a87bbbb9c2f64184');
    res.render('home', {currentUser});
}

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

//continue with review capabilities. Filter by highest and lowest;
///remove from cart, unwatch, unlike
///possibly make 'notifypricechange' more general so it can give ANY notification pushed to it
///rather than just notify price change!
///recommended on home page based on categories, subcategories
////look up packages for processing totals or create it yourself by adding taxes by location visa address
///create review portion
///create Review Model
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



