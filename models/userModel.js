let mongoose = require('mongoose');
const { schema } = require('./itemModel');
let Schema = mongoose.Schema;
let model = mongoose.model
let passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
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
                    gender: {
                        masc: {
                            type: Number,
                            default: 0
                        },
                        fem: {
                            type: Number,
                            default: 0
                        },
                        top: {
                            type: String,
                            enum: ['masc', 'fem']
                        }
                    },
                    taste: {
                        modern: {
                            type: Number,
                            default: 0
                        },
                        vintage: {
                            type: Number,
                            default: 0
                        },
                        top: {
                            type: String,
                            enum: ['modern', 'vintage']
                        }
                    },
                    age: {
                        old: {
                            type: Number,
                            default: 0
                        },
                        new: {
                            type: Number,
                            default: 0
                        },
                        top: {
                            type: String,
                            enum: ['old', 'new']
                        }
                    },
                    niche: {
                        classic: {
                            type: Number,
                            default: 0
                        },
                        novelty: {
                            type: Number,
                            default: 0
                        },
                        top: {
                            type: String,
                            enum: ['classic', 'novelty']
                        }
                   },
                }
            },
                grocery: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        gender: {
                            masc: {
                                type: Number,
                                default: 0
                            },
                            fem: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['masc', 'fem']
                            }
                        },
                        taste: {
                            modern: {
                                type: Number,
                                default: 0
                            },
                            vintage: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['modern', 'vintage']
                            }
                        },
                        age: {
                            old: {
                                type: Number,
                                default: 0
                            },
                            new: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['old', 'new']
                            }
                        },
                        niche: {
                            classic: {
                                type: Number,
                                default: 0
                            },
                            novelty: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['classic', 'novelty']
                            }
                       },
                    }
                },
                electronics: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        gender: {
                            masc: {
                                type: Number,
                                default: 0
                            },
                            fem: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['masc', 'fem']
                            }
                        },
                        taste: {
                            modern: {
                                type: Number,
                                default: 0
                            },
                            vintage: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['modern', 'vintage']
                            }
                        },
                        age: {
                            old: {
                                type: Number,
                                default: 0
                            },
                            new: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['old', 'new']
                            }
                        },
                        niche: {
                            classic: {
                                type: Number,
                                default: 0
                            },
                            novelty: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['classic', 'novelty']
                            }
                       },
                    }
                },
                toys: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        gender: {
                            masc: {
                                type: Number,
                                default: 0
                            },
                            fem: {
                                type: Number,
                                default: 0
                            },
                        },
                        taste: {
                            modern: {
                                type: Number,
                                default: 0
                            },
                            vintage: {
                                type: Number,
                                default: 0
                            },
                        },
                        age: {
                            old: {
                                type: Number,
                                default: 0
                            },
                            new: {
                                type: Number,
                                default: 0
                            },
                        },
                        niche: {
                            classic: {
                                type: Number,
                                default: 0
                            },
                            novelty: {
                                type: Number,
                                default: 0
                            },
                       },
                    }
                },
                home: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        gender: {
                            masc: {
                                type: Number,
                                default: 0
                            },
                            fem: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['masc', 'fem']
                            }
                        },
                        taste: {
                            modern: {
                                type: Number,
                                default: 0
                            },
                            vintage: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['modern', 'vintage']
                            }
                        },
                        age: {
                            old: {
                                type: Number,
                                default: 0
                            },
                            new: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['old', 'new']
                            }
                        },
                        niche: {
                            classic: {
                                type: Number,
                                default: 0
                            },
                            novelty: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['classic', 'novelty']
                            }
                       },
                    }
                },
                DIY: {
                    main: {
                        type: Number,
                        default: 0
                    },
                    sub: {
                        gender: {
                            masc: {
                                type: Number,
                                default: 0
                            },
                            fem: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['masc', 'fem']
                            }
                        },
                        taste: {
                            modern: {
                                type: Number,
                                default: 0
                            },
                            vintage: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['modern', 'vintage']
                            }
                        },
                        age: {
                            old: {
                                type: Number,
                                default: 0
                            },
                            new: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['old', 'new']
                            }
                        },
                        niche: {
                            classic: {
                                type: Number,
                                default: 0
                            },
                            novelty: {
                                type: Number,
                                default: 0
                            },
                            top: {
                                type: String,
                                enum: ['classic', 'novelty']
                            }
                       },
                    }
                }
            },
            reviews: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'review'
                }
        ],
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
    ////add member since --------- / / / / / / / / / 
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
});

userSchema.method('topSubs', function (category) {
    let currentUser = this;
    let testArr = [];
    for (let subValue of Object.keys(currentUser.history.interest_by_category[category].sub)) {
        let allSubVals = Object.keys(this.history.interest_by_category[category].sub[subValue])
        .filter(x => x !== 'top');
    if (this.history.interest_by_category[category].sub[subValue][allSubVals[0]]
        > this.history.interest_by_category[category].sub[subValue][allSubVals[1]]) {
        testArr.push(allSubVals[0]) 
    } else {testArr.push(allSubVals[1])}
    }
    return testArr;
});

userSchema.method('topCategories', function () {
    let currentUser = this;
    return Object.keys(currentUser.history.interest_by_category).sort(function (a, b) {
        return currentUser.history.interest_by_category[b].main - currentUser.history.interest_by_category[a].main
    });

})

userSchema.method('deleteNotification', function (notifId) {
    this.notifications.pull({ _id: notifId });
    this.save();
    return ''
});
userSchema.plugin(passportLocalMongoose);

let User = model('user', userSchema);

module.exports = User;