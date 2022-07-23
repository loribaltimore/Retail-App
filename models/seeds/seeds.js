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
    console.log(currentUser.topSub('clothing'));
    console.log(currentUser.history.interest_by_category.clothing)
};
// getInfo();
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
  
    ///for each User...
    
    allItems.forEach(async (element, index) => {
        element.reviews = { qty: 0, total_rating: 0, all_reviews: [] };
      
       
              ////select a random user...
            let randomUser = allUsers[Math.floor(Math.random() * (allUsers.length - 1))];
                    ////create a review...
            let newReview = await new Review({
                item: element,
                author: {
                    name: randomUser.bio.name,
                    userId: randomUser.id
                },
                body: casual.description,
                rating: Math.floor(Math.random() * 4 + 1)
            }).save().then(data => { console.log(data); return data }).catch(err => console.log(err));
            //// update the item....
            element.reviews.all_reviews.push(newReview._id);
            let allReviews = element.reviews.all_reviews;
            await Item.findByIdAndUpdate(element.id, {
                reviews: {
                    qty: element.reviews.qty += 1,
                    total_rating: element.reviews.total_rating += newReview.rating,
                    all_reviews: allReviews
                }
            }); 
            ////and update the user.
            randomUser.history.reviews.push(newReview.id);
            // await randomUser.save();

        
    });
};

    // seedReviews();



let randomCategory = function (allCategories) {
    return allCategories[Math.floor(Math.random() * (allCategories.length - 1))];
};

let fiftyfifty = function () {
    let random = Math.floor(Math.random() * 100)
    if (random <= 50) {
        return 0
    } else {
       return 1
    }
};

let randomSubCategories = function () {
    let categoryObj = {};
    let subCatBreakdown = {
        gender: ['masc', 'fem'],
        age: ['old', 'new'],
        taste: ['modern', 'vintage'],
        niche: ['novelty', 'classic'],
    };
    for (let el in subCatBreakdown) {
        let num = fiftyfifty();
        console.log(num)
        categoryObj[el] = subCatBreakdown[el][num];
    };
    console.log(categoryObj);
    return categoryObj;
};
// randomSubCategories();

let seedItems = async (req, res, next) => {
    await Item.deleteMany({});
    let allItems = await Item.find({});
    let allUsers = await User.find({});
    allUsers.forEach((element, index) => {
        element.history.reviews = [];
        element.history.liked = [];
        element.history.watching = [];
        element.history.created = [];
    });
    let allCategories = ['clothing', 'grocery', 'electronics', 'home', 'DIY', 'toys'];
    let allSubCategories = ['masc', 'fem', 'novelty', 'vintage', 'old', 'new', 'classic', 'modern'];
    for (let i = 0; i < 1000; i++){
        let randomCat = randomCategory(allCategories);
        let subCatObj = randomSubCategories(allSubCategories);
        console.log(randomCat, subCatObj);
        let currentUser = allUsers[Math.floor(Math.random() * (allUsers.length - 1))];
        let newItem = await new Item({
            name: casual.word,
            category: {
                catId: mongoose.Types.ObjectId(),
                main: randomCat,
                sub: subCatObj
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
        console.log(newItem.id)
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

let random = function () {
    return Math.floor(Math.random() * 100);
}
let seedInterest = async (req, res, next) => {
    let allUsers = await User.find({});
    for (let currentUser of allUsers) {
        currentUser.history.interest_by_category = {};
        let allCats = Object.keys(currentUser.history.interest_by_category);
        for (let cat of allCats) {
            currentUser.history.interest_by_category[cat].main = random();
            let allSubs = Object.keys(currentUser.history.interest_by_category[cat].sub);
            allSubs.forEach(function (element, index) {
                let allSubVals = Object.keys(currentUser.history.interest_by_category[cat].sub[element]);
                allSubVals.forEach(function (el, index) {
                    if (el !== 'top') {
                        currentUser.history.interest_by_category[cat].sub[element][el] = random();
                    } else {
                        currentUser.history.interest_by_category[cat].sub[element]
                    }
                });

            });
        }
        await currentUser.save();
    }
   
}
// seedInterest();