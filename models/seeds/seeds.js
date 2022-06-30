let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let model = mongoose.model;
let Item = require('../itemModel');
let User = require('../userModel');
let Review = require('../reviewModel');
let casual = require('casual');
mongoose.connect('mongodb://localhost:27017/amazon')
    .then(console.log('Database Ready for Seed'))
    .catch(err => console.log(err));

// let seedItems = async(req, res, next) => {
//     let newItem = new Item({
//         name: 'Shower Head',
//         category: {
//             catId: mongoose.Types.ObjectId(),
//             main: 'home',
//             sub: ['fem', 'new', 'modern']
//         },
//         price: 29.99,
//         img: [
//             {
//                 filename: 'user-photos/waxjanmzemsc7op4yfzp',
//                 path: 'https://res.cloudinary.com/demgmfow6/image/upload/v1647578718/user-photos/waxjanmzemsc7op4yfzp.jpg',
//             }
//         ],
//     }).save();
//     console.log('Seed Items Done')
// }

let getInfo = async (req, res, next) => {
    let allItems = await Item.find({});
    let allUsers = await User.find({});
    console.log(allUsers.length);
    // await Item.deleteMany({'reviews.all_reviews': []})
    // console.log(allItems.filter(function (element, index) {
    //     if (element.reviews.all_reviews.length === 0) {
    //         return element
    //     }
    // }));
 
//   console.log(allUsers.history.interest_by_category)
    // let allItems = await Item.find({});
    // console.log(allItems);

}
// getInfo();
let seedUsers = async (req, res, next) => {
    for (let i = 0; i < 50; i++){
        let newUser = await new User({
            bio: {
                name: casual.first_name,
                address: {
                    shipping: casual.address,
                    billing: casual.address
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
    allItems.forEach(async (element, index) => {
        element.reviews = { qty: 0, total_rating: 0, all_reviews: [] }
        await element.save();
    });
    ///for each User...
    allUsers.forEach(async (element, index) => {
        element.reviews = [];
        ////select a random item...
       let randomItem = allItems[Math.floor(Math.random() * allItems.length)];
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
        }, {new: true}).then(data => console.log(data)).catch(err => console.log(err));
        ////and update the user.
        element.reviews.push(newReview.id);
        await element.save();
        
    });
};

seedReviews();

let seedClothing = async (req, res, next) => {
    // await Item.deleteMany({});
    let currentUser = await User.findById('62b1dc6f8f0a7fddbd777a97');
    currentUser.history.created = [];
    for (let i = 0; i < 20; i++){
        let newItem = await new Item({
            name: 'Mens Pants',
            category: {
                catId: mongoose.Types.ObjectId(),
                main: 'clothing',
                sub: ['masc', 'new', 'modern']
            },
            price: 29.95,
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
            reviews: {
                qty: 10,
                avg: Math.floor(Math.random() * 5)
            },
            description: 'Manly pants for hard working men!',
            author: '62b1dc6f8f0a7fddbd777a97',
        }).save()
            .then(data => {return data})
            .catch(err => console.log(err));
        currentUser.history.created.push(newItem.id);
    }
   await currentUser.save();
    console.log('Seed Clothes Finished');
}

// seedClothing();

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