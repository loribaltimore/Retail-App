let express = require('express');
let itemRouter = express.Router({mergeParams: true});
let { renderHome, renderItem, } = require('../itemController');
let { locals } = require('../../middleware/locals');
let { session } = require('../../middleware/session');
let { errCatch } = require('../../middleware/functions');
itemRouter.use(session, locals);

itemRouter.route('/:itemId')
    .get(errCatch(renderItem));



  

module.exports = itemRouter;