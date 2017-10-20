const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
    name:String
}, { timestamps: true});

const venueSchema = new mongoose.Schema({
    name: String,
    address: String,
    email:String,
    phone:Number,
    sport: [sportSchema],
    // photos: [picturesSchema],
    // timings:{startTime:Date, endTime:Date },
     prices: Number,
     description: String,
    // review:[commentSchema],
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
    username:String,
    rating:Number,
    feedback:String
}, { timestamps: true});

const picturesSchema = new mongoose.Schema({
    path:String
}, { timestamps: true});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;