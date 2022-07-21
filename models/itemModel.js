let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let model = mongoose.model;

let itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        catId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        main: {
            type: String,
            enum: ['clothing', 'grocery', 'home', 'electronics', 'DIY', 'toys'],
            required: true
        },
        sub: [
            {
                type: String,
                enum: ['masc', 'fem', 'novelty', 'vintage', 'old', 'new', 'classic', 'modern'],
                required: true
            }
        ],
        connections: [
            {
                type: mongoose.Types.ObjectId,
                
            }
        ]
    },
    price: {
        type: Number,
        required: true
    },
    img: [
        {
            path: {
                type: String,
                required: true
            },
            filename: {
                type: String,
                required: true
            }
        }
    ],
    reviews: {
        qty: {
            type: Number,
            default: 0,
            required: true
        },
        total_rating: {
            type: Number,
            default: 0,
            required: true
        },
        all_reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'review'
            }
        ]
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    user_engagement: {
        liked_by: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        watched_by: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        total_interest: {
            type: Number,
            default: 0
        }
    }
});

itemSchema.virtual('averageRating').get(function () {
    return this.reviews.total_rating / this.reviews.qty;
});


let Item = model('item', itemSchema);
module.exports = Item;