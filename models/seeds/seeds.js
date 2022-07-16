let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let model = mongoose.model;
let Item = require('../itemModel');
let User = require('../userModel');
let Review = require('../reviewModel');
let casual = require('casual');
let { salesTaxByState } = require('./sales_tax');
const { default: axios } = require('axios');
mongoose.connect('mongodb://localhost:27017/amazon')
    .then(console.log('Database Ready for Seed'))
    .catch(err => console.log(err));
let createClient = require('@mapbox/mapbox-sdk/services/geocoding');
let mapboxClient = createClient({ accessToken: 'pk.eyJ1IjoibG9yaWJhMXRpbW9yZSIsImEiOiJja3ppbjA3Z3kwc2VrMnBxaGsxY3o0dnQ4In0.QzBP8BoDRGZetSuQiMVY7A'});


let getInfo = async (req, res, next) => {
    let allItems = await Item.find({});
    let allUsers = await User.find({});
    let currentUser = await User.findById('62cade6087fd406e68edfcb2');
    allItems.forEach(async (element, index) => {
        element.user_engagement.total_interest = 0;
        await element.save();
    });
    let allCats = Object.keys(currentUser.history.interest_by_category);
    for (let cat of allCats) {
        currentUser.history.interest_by_category[cat] = {
            main: 0,
            sub: {
                masc: 0,
                fem: 0,
                novelty: 0,
                vintage: 0,
                old: 0,
                new: 0,
                classic: 0,
                modern: 0,
            }
        }
    }
    await currentUser.save();
};
getInfo();
let seedUsers = async (req, res, next) => {
    let allUsers = await User.deleteMany({});
    for (let i = 0; i < 50; i++){
        let newUser = await new User({
            bio: {
                name: casual.first_name,
                email: `${casual.word}@gmail.com`,
                address: {
                    shipping: {
                        street: casual.address1,
                        state: casual.state,
                        zip: casual.zip(digits = 5)
                    },
                    billing: {
                        street: casual.address1,
                        state: casual.state,
                        zip: casual.zip(digits = 5)
                    },
                    sales_tax: 9.5
                },
                phone: casual.phone,
            }
        }).save();
    };

  
};

// seedUsers();

let seedReviews = async (req, res, next) => {
    let allUsers = await User.find({});
    let allItems = await Item.find({});
        ///delete all Reviews
    await Review.deleteMany({});
    ///change all item reviews to 0 / 0
    // allItems.forEach(async (element, index) => {
    //     element.reviews = { qty: 0, total_rating: 0, all_reviews: [] }
    //     await element.save();
    // });
    ///for each User...
    allUsers.forEach(async (element, index) => {
        ////select a random item...
       let randomItem = allItems[Math.floor(Math.random() * (allItems.length - 1))];
        ////create a review...
        let newReview = await new Review({
            item: randomItem,
            author: {
                name: element.bio.name,
                userId: element.id
            },
            body: casual.description,
            rating: Math.floor(Math.random() * 4 + 1)
        }).save().then(data => { console.log(data); return data }).catch(err => console.log(err));
        //// update the item....
        randomItem.reviews.all_reviews.push(newReview._id);
        let allReviews = randomItem.reviews.all_reviews;
        await Item.findByIdAndUpdate(randomItem.id, {
            reviews: {
                qty: randomItem.reviews.qty += 1,
                total_rating: randomItem.reviews.total_rating += newReview.rating,
                all_reviews: allReviews
            }
        }); 
        ////and update the user.
        element.history.reviews.push(newReview.id);
        await element.save();
        
    });
};
for (let i = 0; i < 10; i++){
// seedReviews();
};

let randomCategory = function (allCategories) {
    return allCategories[Math.floor(Math.random() * (allCategories.length - 1))];
};

let randomSubCategories = function (allSubCategories) {
    let categoryArr = [];
    for (let i = 0; i < 3; i++) {
        categoryArr.push(allSubCategories[Math.floor(Math.random() * allSubCategories.length)]);
    };
    return categoryArr;
}

let seedItems = async (req, res, next) => {
    await Item.deleteMany({});
    let allUsers = await User.find({});
    allUsers.forEach((element, index) => {
        element.history.reviews = [];
        element.history.liked = [];
        element.history.watching = [];
        element.history.created = [];
        element.history.interest_by_category.clothing = 0;
    });
    let allCategories = ['clothing', 'grocery', 'electronics', 'home', 'DIY', 'toys'];
    let allSubCategories = ['masc', 'fem', 'novelty', 'vintage', 'old', 'new', 'classic', 'modern'];
    console.log(randomCategory(allCategories))

    for (let i = 0; i < 75; i++){
        let randomCat = randomCategory(allCategories);
        let subCatArr = randomSubCategories(allSubCategories);
        console.log(randomCat, subCatArr);
        let currentUser = allUsers[Math.floor(Math.random() * (allUsers.length - 1))];
        let newItem = await new Item({
            name: casual.word,
            category: {
                catId: mongoose.Types.ObjectId(),
                main: randomCat,
                sub: subCatArr
            },
            price: parseFloat(`${casual.integer(from = 5, to = 199)}.99`),
            img: [
                {
                    path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1647578718/user-photos/waxjanmzemsc7op4yfzp.jpg',
                    filename: 'user-photos/waxjanmzemsc7op4yfzp'
                },
                    {
                        filename: 'user-photos/kqgc10nhk5ameyu7tjjd',
                        path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1647578718/user-photos/kqgc10nhk5ameyu7tjjd.jpg'
                    }
            ],
            description: casual.sentence,
            author: currentUser.id,
        }).save()
            .then(data => {return data})
            .catch(err => console.log(err));
        currentUser.history.created.push(newItem.id);
        await currentUser.save();
    }
    console.log('Seed Clothes Finished');
}

// seedItems();

let addImg = async (req, res, next) => {
    let allItems = await Item.find({})
    allItems.forEach(async (element, index) => {
        element.img = [];
        element.img.push({
            path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1647578718/user-photos/waxjanmzemsc7op4yfzp.jpg',
            filename: 'user-photos/waxjanmzemsc7op4yfzp'
        },
            {
                filename: 'user-photos/kqgc10nhk5ameyu7tjjd',
                path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1647578718/user-photos/kqgc10nhk5ameyu7tjjd.jpg'
            });
        await element.save();
    })
    console.log('Done adding images')
};
// addImg();

let locationTest = async () => {
    let currentUser = await User.findById('62b1dc6f8f0a7fddbd777a97');
    let address = '427 Bellevue Way SE';
    let info = await mapboxClient.forwardGeocode({
        query: address,
        limit: 2
    }).send()
        .then(data => { return data }).catch(err => console.log(err));
    console.log(info.body.features[0].geometry);
    currentUser.bio.address.geometry = info.body.features[0].geometry;
    await currentUser.save();
    console.log(currentUser.bio.address);
};

// locationTest();



let interestBycategory = async (req, res, next) => {
    let currentUser = await User.findByIdAndUpdate('62cade6087fd406e68edfcb2');
    currentUser.history.interest_by_category = {};
    await currentUser.save();
};
// interestBycategory();

// let removeOldItems = function () {
//     let allItems = await Item.find({});
//     allItems.forEach((function (element, index) {

//     }))
// }