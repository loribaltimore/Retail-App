let express = require('express');
let shopRouter = express.Router({mergeParams: true});
let { renderCategory, renderItem, itemEngagement, itemReview } = require('../itemController');
let { userCart, callSession } = require('../userController');
let { locals } = require('../../middleware/locals');
let { session } = require('../../middleware/session');
shopRouter.use(locals);
shopRouter.use((req, res, next) => {
    let acceptableParams = ['clothing', 'grocery', 'home', 'electronics', 'DIY', 'toys', 'cart'];
    if (acceptableParams.indexOf(req.params.category) < 0) {
        console.log(req.params.category);
        return res.send('not a valid route for Shop Router')
    };
    next();
})
shopRouter.get('/', renderCategory);
shopRouter.route('/qty')
    .post(userCart)

shopRouter.route('/:itemId')
    .get(session, renderItem)
    .post(itemEngagement);


shopRouter.post('/:itemId/review', itemReview);

shopRouter.route('/:itemId/review/:reviewId')
    .put(itemReview)
    .delete(itemReview);

shopRouter.post('/:itemId/session', callSession);


module.exports = shopRouter;

