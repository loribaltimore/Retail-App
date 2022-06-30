let mongoose = require('mongoose');
const { schema } = require('./itemModel');
let Schema = mongoose.Schema;
let model = mongoose.model

let userSchema = new Schema({
    bio: {
        email: {
            type: String,
            requied: true
        },
        name: {
            type: String,
            required: true
        },
        address: {
            shipping: {
                type: String,
                required: true
            },
            billing: {
                type: String,
                required: true
            }
        },
        phone: {
            type: String,
            required: true
        }
    },
    history: {
        liked: [
            {
                type: Schema.Types.ObjectId,
                ref: 'item'
            }
        ],
        watching: [
            {
                type: Schema.Types.ObjectId,
                ref: 'item'
            }
        ],
        purchased: [
            {
                type: Schema.Types.ObjectId,
                ref: 'item'
            }
        ],
        created: [
            {
                type: Schema.Types.ObjectId,
                ref: 'item'
            }
        ],
        interest_by_category: {
            clothing: {
                type: Number,
                default: 0
            },
            gorcery: {
                type: Number,
                default: 0
            },
            electronics: {
                type: Number,
                default: 0
            },
            toys: {
                type: Number,
                default: 0
            },
            home: {
                type: Number,
                default: 0
            },
            DIY: {
                type: Number,
                default: 0
            }
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'review'
            }
        ]
    },
    notifications: [
        {
            message: {
                type: String,
                required: true
            },
            category: {
                type: String,
                enum: ['profile', 'recommend', 'feature', 'sale'],
                required: true
            },
            item: {
                item_id: {
                    type: Schema.Types.ObjectId,
                    ref: 'item'
                },
                item_img: {
                    type: String
                },
                item_price: {
                    type: Number
                },
                item_category: {
                    type: String,
                }
            },
            sort: {
                type: Number,
                default: 0
            }
        }
    ],
});

userSchema.virtual('topCategory').get(function () {
    let categories = Object.keys(this.history.interest_by_category);
    let currentUser = this;
    return categories.map(function (element, index) {
        return [element, currentUser.history.interest_by_category[element]];
    }).sort((a, b) => a - b);
});

userSchema.method('deleteNotification', function (notifId) {
    this.notifications.pull({ _id: notifId });
    this.save();
    return ''
});

let User = model('user', userSchema);

module.exports = User;