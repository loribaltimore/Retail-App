let {body, check, validationResult} = require('express-validator');

module.exports.categoryValidation = async (req, res, next) => {
    let acceptableRoutes = ['profile', 'item', 'shop', 'notifications',]
    if (acceptableRoutes.indexOf(req.params.category) < 0) {
        req.flash('error', 'You must enter a valid route');
        
        ///redirect to login
        return res.send('not valid route')
    }
    next();
};

module.exports.userValidation = async (req, res, next) => {
    return [
    ];
}

module.exports.expressValidateTest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        res.send({});
    }
};