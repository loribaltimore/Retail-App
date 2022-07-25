class CustomError extends Error{
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
};

let errHandler = async (err, req, res, next) => {
    let { message, status } = err;
    console.log(status)
    res.status(status).render('errorPage', { message, status });
}

module.exports = {CustomError, errHandler}