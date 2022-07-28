class CustomError extends Error{
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
};

let errHandler = async (err, req, res, next) => {
    let { message, stack } = err;
    console.log(stack);
    let status = (err.status || 200);
    res.status(status).render('errorPage', { message, stack, status });
}

module.exports = {CustomError, errHandler}