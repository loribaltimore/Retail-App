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
let helmet = require('helmet');
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
let { myHashing } = require('./middleware/validators');
let shopRouter = require('./controllers/routers/shopRouter');
let itemRouter = require('./controllers/routers/itemRouter');
let userRouter = require('./controllers/routers/userRouter');
let MongoStore = require('connect-mongo');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(express.json());
let crypto = require('crypto');
let { hash, scriptSrcValidator, setSecurityPolicy } = require('./middleware/validators');
let { errCatch } = require('./middleware/functions');
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy({
    policy: 'credentialless'
}));
app.use((req, res, next) => {
    console.log('wsdfsd')
    res.locals.hash = crypto.randomBytes(16).toString('hex')
    next()
});
app.use(helmet.contentSecurityPolicy({
    directives: {
        'script-src': [
            'self',
            (req, res) => { return `'nonce-${res.locals.hash}'` },
            'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js',
            'http://localhost:3001/js/userScript.js',
            'http://localhost:3001/js/bootstrap.min.js',
            'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
        ],
        'img-src': ['self', 'blob:', 'data:', `https://res.cloudinary.com/demgmfow6/`],
        'style-src': [
            'self',
            (req, res) => { return `'nonce-${res.locals.hash}'` },
            'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css',
            'http://localhost:3001/css/bootstrap.min.css',
            'http://localhost:3001/css/styles1.css',
            
        ]
    }
}));
app.use(mongoSanitize());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
if (process.env.NODE_ENV !== 'production') {
    secret = ['thisisusedtohashtheid', 'thisisusedforverification', 'thisisalsousedforcerification'];
    dbUrl = 'mongodb://localhost:27017/amazon';
} else { secret = process.env.SECRET; dbUrl = process.env.MONGO_ATLAS}
let sessionConfig = {
    secret: secret,
    name: 'changethisnametokeepthehackersguessing',
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({mongoUrl: dbUrl}),
    cookie: {
        httpOnly: true,
        sameSite: true,
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

mongoose.connect(dbUrl)
    .then(console.log('Database is live'))
    .catch(err => next(err));
const port = (process.env.PORT || 3001);
app.listen(port, () => {
    console.log('Server Live')
});
app.use('/shop/:userId/:category/', shopRouter);
app.use('/user/:userId/:category', userRouter);
app.use('/shop/:category/item', itemRouter);
app.use(errHandler);

///unsafe inline ==== get inline scripts to work wit helmet before moving forward