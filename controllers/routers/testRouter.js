let express = require('express');
let testRouter = express.Router({ mergeParams: true });
let passport = require('passport');
let LocalStrategy = require('passport-local');
let { updateItem, createItem, deleteItem,
    renderCreateItem, renderHome, renderAllItems,
    renderUpdateItem, deleteNotifications, renderSignup,
createUser, renderLogin, userLogin} = require('../userController');
let { renderItem } = require('../itemController')
let { fetchLocationData, errCatch } = require('../../middleware/functions');
let storage = require('../../middleware/cloudinaryConfig');
let multer = require('multer');
let upload = multer({ storage: storage });
let { CustomeError } = require('../../middleware/errHandling');
let { locals } = require('../../middleware/locals');
let { session } = require('../../middleware/session');
const { categoryValidation, expressValidateTest, userValidation } = require('../../middleware/validators');
testRouter.use(session, locals, categoryValidation);
let { body, check, validationResult } = require('express-validator');

testRouter.route('/')
    .get(renderLogin)

module.exports = testRouter;