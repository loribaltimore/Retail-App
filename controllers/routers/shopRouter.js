let express = require('express');
let shopRouter = express.Router({mergeParams: true});
let { renderCategory, renderItem, itemEngagement, itemReview } = require('../itemController');
let { userCart, callSession } = require('../userController');
let { locals } = require('../../middleware/locals');
let { session } = require('../../middleware/session');
let { errCatch } = require('../../middleware/functions');
shopRouter.use(locals);
shopRouter.use((req, res, next) => {
    let acceptableParams = ['clothing', 'grocery', 'home', 'electronics', 'DIY', 'toys', 'cart'];
    if (acceptableParams.indexOf(req.params.category) < 0) {
        console.log(req.params.category);
        return res.send('not a valid route for Shop Router')
    };
    next();
})
shopRouter.get('/', errCatch(renderCategory));
shopRouter.route('/qty')
    .post(errCatch(userCart))

shopRouter.route('/:itemId')
    .get(errCatch(session), errCatch(renderItem))
    .post(errCatch(itemEngagement));


shopRouter.post('/:itemId/review', errCatch(itemReview));

shopRouter.route('/:itemId/review/:reviewId')
    .put(errCatch(itemReview))
    .delete(errCatch(itemReview));

shopRouter.post('/:itemId/session', errCatch(callSession));


module.exports = shopRouter;

