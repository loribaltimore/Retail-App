let {body, check, validationResult} = require('express-validator');
let { CustomError } = require('./errHandling');
const crypto = require('crypto');

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
        console.log(errors.erros);
        throw new CustomError('Error Creating Account. Please Try Again', 404);
    } else {
        next();
    }
};



let hash = crypto.randomBytes(16).toString('base64');
module.exports.scriptSrcValidator = (res) => {
    let hash = undefined;
    if (res.locals.hash !== undefined) {
         hash = res.locals.hash;
    } else { hash = crypto.randomBytes(16).toString('hex');}
    return[
        'self',
        `'nonce-${hash}'`,
        'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js',
        'http://localhost:3001/js/userScript.js',
        'http://localhost:3001/js/bootstrap.min.js',
        'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
    ];
};
module.exports.imgSrcValidator = ['self', 'blob:', 'data:', `https://res.cloudinary.com/demgmfow6/`],
    module.exports.styleSrcValidator = [
        'self',
        'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css',
        'http://localhost:3001/css/bootstrap.min.css',
        'http://localhost:3001/css/styles1.css',
    
    ];

module.exports.percentEncoderforMongoAtlas = function (psswrd) {
    let forbiddenChar = ':/?#[]@';
    return psswrd.split('').map(function (element, index) {
        if (forbiddenChar.indexOf(element) >= 0) {
            let convertedChar = element.charCodeAt(0);
            return `%${convertedChar}`
        } else {return element}
    }).join('')
};
///continue with error handling
///why cant I make custom messages for validation errors
///continue then to helmet for header security
///then to configuring cookie and session for safety and security 