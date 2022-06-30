class ShoppingCartItem{
    constructor(item, qty, sort) {
        this.item = item;
        this.qty = qty;
        this.sort = 0;
    }
    removeItem(req) {
        this.sort = 1;
        req.session.cart.sort((a, b) => a - b).pop();
    }
    changeQty(req, num) {
        this.qty += num;
        if ((this.qty += num) <= 0) {
            this.removeItem(req);
        }
    }
};



class Notification{
    constructor(message, category, item, sort) {
        this.message = message;
        this.category = category;
        this.item = item;
        this.sort = 0
    }
    async removeNotification(currentUser) {
        currentUser.notifications.pull({ message: this.message });
        await currentUser.save();
    }
    
}

const newNotification = async (currentUser, currentItem, category) => {
    let message = undefined;
    let item = {
        item_id: currentItem.id,
        item_img: currentItem.img[0].path,
        item_price: currentItem.price,
        item_category: currentItem.category.main
    };
    switch (category) {
        case 'sale':
            message = `${currentItem.name} is on sale!`
            break;
        case 'recommended':
            message = `Recommended Item: ${currentItem.name}`
            break;
        case 'profile':
            message = 'Action needed in user profile..'
            break;
    }
    let newNotification = new Notification(message, category, item);
    currentUser.notifications.push(newNotification);
    await currentUser.save();
    console.log('newNotification is working')
}

const notifyPriceChange = async (currentItem, currentUser) => {
    console.log('notify price change working')
    let allWatchingUsers = await currentItem.populate({ path: 'user_engagement.watched_by' })
        .then(data => { return data.user_engagement.watched_by }).catch(err => console.log(err));
    allWatchingUsers.forEach(async (element, index) => {
        await newNotification(element, currentItem, 'sale')
            .then(data => { return data })
            .catch(err => console.log(err));
    });
};

module.exports = { ShoppingCartItem, notifyPriceChange, Notification, newNotification };
