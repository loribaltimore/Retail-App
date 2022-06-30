let express = require('express');
let shopRouter = express.Router({mergeParams: true});
let {renderCategory, renderItem, itemEngagement} = require('../itemController');
let { locals } = require('../../middleware/locals');
let { session } = require('../../middleware/session');
shopRouter.use(locals);
shopRouter.use((req, res, next) => {
    let acceptableParams = ['clothing', 'gorcery', 'home', 'electronics', 'DIY', 'toys'];
    if (acceptableParams.indexOf(req.params.category) < 0) {
        return res.send('not a valid route for Shop Router')
    };
    next();
})
shopRouter.get('/', renderCategory);
shopRouter.route('/:itemId')
    .get(session, renderItem)
    .post(itemEngagement);


module.exports = shopRouter;

