let {body, check, validationResult} = require('express-validator');
let { CustomError } = require('./errHandling');
module.exports.categoryValidation = async (req, res, next) => {
    let acceptableRoutes = ['profile', 'item', 'shop', 'notifications',]
    if (acceptableRoutes.indexOf(req.params.category) < 0) {
        req.flash('error', 'You must enter a valid route');
        
        ///redirect to login
        return res.send('not valid route')
    }
    next();
};

module.exports.expressValidateTest = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       
        throw new CustomError('No Bueno', 404);
    } else {
        next();
    }
};

///continue with error handling
///why cant I make custom messages for validation errors
///continue then to helmet for header security
///then to configuring cookie and session for safety and security 