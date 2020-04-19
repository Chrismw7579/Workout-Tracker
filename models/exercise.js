const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: String,
    type: String,
    duration: Number,
    distance: Number,
    weight: Number,
    sets: Number,
    reps: Number
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;