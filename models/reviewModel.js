let mongoose = require('mongoose');
const Item = require('./itemModel');
let Schema = mongoose.Schema;
let model = mongoose.model;

let reviewSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'item'
    },
    author: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    },
    body: {
        type: String,
        maxlength: 300
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    }
}, { timestamps: true });

reviewSchema.virtual('getAuthor').get(async () => {
    let author = await this.populate({ path: 'author.userId' })
        .then(data => { return data }).catch(err => console.log(err));
    return author
});

reviewSchema.virtual('getItem').get(async () => {
    let currentReview = this;
    let reviewItem = await Item.findById(currentReview.item)
        .then(data => { return data })
        .catch(err => console.log(err));
    return reviewItem
});


let Review = model('review', reviewSchema);

module.exports = Review;

///continue with review functionality