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
                street: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                zip: {
                    type: String,
                    required: true
                }
            },
            billing: {
                street: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                zip: {
                    type: String,
                    required: true
                }
            },
            geometry: {
                type: {
                    type: String,
                    enum: ['Point'],
                    defualt: 'Point'
                },
                coordinates: {
                    type: Array,
                    default: []
                }
            },
            sales_tax: {
                type: Number,
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
                main: {
                    type: Number,
                    default: 0
                },
                sub: {
                    masc: {
                        type: Number,
                        default: 0
                    },
                    fem: {
                        type: Number,
                        default: 0
                    },
                    novelty: {
                        type: Number,
                        default: 0
                    },
                    vintage: {
                        type: Number,
                        default: 0
                    },
                    old: {
                        type: Number,
                        default: 0
                    },
                    new: {
                        type: Number,
                        default: 0
                    },
                    classic: {
                        type: Number,
                        default: 0
                    },
                    modern: {
                        type: Number,
                        default: 0
                    },

                }
                },
                grocery: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        masc: {
                            type: Number,
                            default: 0
                        },
                        fem: {
                            type: Number,
                            default: 0
                        },
                        novelty: {
                            type: Number,
                            default: 0
                        },
                        vintage: {
                            type: Number,
                            default: 0
                        },
                        old: {
                            type: Number,
                            default: 0
                        },
                        new: {
                            type: Number,
                            default: 0
                        },
                        classic: {
                            type: Number,
                            default: 0
                        },
                        modern: {
                            type: Number,
                            default: 0
                        },
    
                    }
                },
                electronics: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        masc: {
                            type: Number,
                            default: 0
                        },
                        fem: {
                            type: Number,
                            default: 0
                        },
                        novelty: {
                            type: Number,
                            default: 0
                        },
                        vintage: {
                            type: Number,
                            default: 0
                        },
                        old: {
                            type: Number,
                            default: 0
                        },
                        new: {
                            type: Number,
                            default: 0
                        },
                        classic: {
                            type: Number,
                            default: 0
                        },
                        modern: {
                            type: Number,
                            default: 0
                        },
    
                    }
                },
                toys: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        masc: {
                            type: Number,
                            default: 0
                        },
                        fem: {
                            type: Number,
                            default: 0
                        },
                        novelty: {
                            type: Number,
                            default: 0
                        },
                        vintage: {
                            type: Number,
                            default: 0
                        },
                        old: {
                            type: Number,
                            default: 0
                        },
                        new: {
                            type: Number,
                            default: 0
                        },
                        classic: {
                            type: Number,
                            default: 0
                        },
                        modern: {
                            type: Number,
                            default: 0
                        },
    
                    }
                },
                home: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        masc: {
                            type: Number,
                            default: 0
                        },
                        fem: {
                            type: Number,
                            default: 0
                        },
                        novelty: {
                            type: Number,
                            default: 0
                        },
                        vintage: {
                            type: Number,
                            default: 0
                        },
                        old: {
                            type: Number,
                            default: 0
                        },
                        new: {
                            type: Number,
                            default: 0
                        },
                        classic: {
                            type: Number,
                            default: 0
                        },
                        modern: {
                            type: Number,
                            default: 0
                        },
    
                    }
                },
                DIY: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        masc: {
                            type: Number,
                            default: 0
                        },
                        fem: {
                            type: Number,
                            default: 0
                        },
                        novelty: {
                            type: Number,
                            default: 0
                        },
                        vintage: {
                            type: Number,
                            default: 0
                        },
                        old: {
                            type: Number,
                            default: 0
                        },
                        new: {
                            type: Number,
                            default: 0
                        },
                        classic: {
                            type: Number,
                            default: 0
                        },
                        modern: {
                            type: Number,
                            default: 0
                        },
    
                    }
                }
            },
            
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'review'
            }
    ],
        
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

userSchema.virtual('sortedSubs').get(function (mainCat) {
    let currentUser = this;
    let allSubs = Object.keys(this.history.interest_by_category[mainCat].sub);
    return allSubs.sort(function (a, b) {
        return this.history.interest_by_category[mainCat].sub[a]
            - this.history.interest_by_category[mainCat].sub[b];
    });
})

userSchema.method('deleteNotification', function (notifId) {
    this.notifications.pull({ _id: notifId });
    this.save();
    return ''
});

let User = model('user', userSchema);

module.exports = User;