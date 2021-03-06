let rates = [
    9.24,
    1.76,
    8.4,
    9.47,
    8.82,
    7.77,
    6.35,
    0,
    7.01,
    7.35,
    4.44,
    6.02,
    8.81,
    7,
    6.94,
    8.7,
    6,
    9.55,
    5.5,
    6,
    6.25,
    6,
    7.49,
    7.07,
    8.29,
    0,
    6.94,
    8.23,
    0,
    6.60,
    7.84,
    8.52,
    6.98,
    6.96,
    7.22,
    8.97,
    0,
    6.34,
    7,
    7.44,
    6.4,
    9.55,
    8.20,
    7.19,
    6.24,
    5.75,
    9.29,
    6.52,
    5.43,
    5.22
]


let states =
    [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'
    ]

module.exports.salesTaxByState = states.map(function (element, index) {
    return { state: element, rate: rates[index] };
})
module.exports.states = states;
