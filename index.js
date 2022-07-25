if (process.env.NODE_env !== 'production') {
    require('dotenv').config();
};
let express = require('express');
let app = express();
let path = require('path');
let mongoose = require('mongoose');
let methodOverride = require('method-override');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let ejsMate = require('ejs-mate');
let { errHandler } = require('./middleware/errHandling');
let axios = require('axios');
let expressValidate = require('express-validator');
let cloudinary = require('cloudinary');
let mongoSanitize = require('express-mongo-sanitize');
let { CloudinaryStorage } = require('multer-storage-cloudinary');
let multer = require('multer');
let passport = require('passport');
let LocalStrategy = require('passport-local');
let User = require('./models/userModel');
let flash = require('connect-flash');
let shopRouter = require('./controllers/routers/shopRouter');
let itemRouter = require('./controllers/routers/itemRouter');
let userRouter = require('./controllers/routers/userRouter');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
let sessionConfig = {
    secret: 'secret',
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 300000
    }
};
app.use(session(sessionConfig));
app.use(flash(sessionConfig));
app.use(passport.initialize());
app.use(passport.session(sessionConfig))
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
mongoose.connect('mongodb://localhost:27017/amazon')
    .then(console.log('Database is live'))
    .catch(err => console.log(err));
app.listen(3001, () => {
    console.log('Server Live')
});
app.use('/shop/:userId/:category/', shopRouter);
app.use('/user/:userId/:category', userRouter);
app.use('/shop/:category/item', itemRouter);
app.use(errHandler);
