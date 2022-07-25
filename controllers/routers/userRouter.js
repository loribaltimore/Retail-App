let express = require('express');
let userRouter = express.Router({ mergeParams: true });
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
let { locals } = require('../../middleware/locals');
let { session } = require('../../middleware/session');
const { categoryValidation, expressValidateTest, userValidation } = require('../../middleware/validators');
userRouter.use(session, locals, categoryValidation);
let {body, check, validationResult} = require('express-validator');

userRouter.route('/signup')
    .get(renderSignup)
    .post([
        check('bio[name]').escape().trim().isLength({ min: 1, max: 12 }).isAlpha(),
        check('bio[email]').escape().trim().isEmail().normalizeEmail(),
        check('bio[phone]').escape().trim().isNumeric(),
        check('username').escape().trim().isAlphanumeric().isLength({min: 8}),
        check('password').escape().trim().isLength({ min: 8 }),
    ], errCatch(expressValidateTest), errCatch(createUser))
///create errorHandler ------------

userRouter.route('/login')
    .get(renderLogin)
.post(passport.authenticate('local', {failureFlash: 'Cannot Authenticate User', failureRedirect: 'login'}), userLogin)

userRouter.get('/locationData', fetchLocationData);

userRouter.get('/home', expressValidateTest, renderHome);
userRouter.get('/myItems', renderAllItems);
userRouter.post('/:notifId', deleteNotifications);
userRouter.route('/create')
.get(renderCreateItem)
    .post(upload.array('img'), createItem)



userRouter.route('/:itemId')
    .get(renderItem)
.put(upload.array('img'), updateItem)
    .delete(deleteItem);
    



    

module.exports = userRouter;