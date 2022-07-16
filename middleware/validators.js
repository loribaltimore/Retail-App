module.exports.categoryValidation = async (req, res, next) => {
    let acceptableRoutes = ['profile', 'item', 'shop', 'notifications', ]
    if (acceptableRoutes.indexOf(req.params.category) < 0) {
        req.flash('error', 'You must enter a valid route');
        
        ///redirect to login
        return res.send('not valid route')
    }
    next();
}