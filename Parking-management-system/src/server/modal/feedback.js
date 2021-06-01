const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Feedback = new Schema({
    title: {type: String},
    description: {type: String},
    byuser: {type: String},
    reply: {type: String}
});

module.exports = mongoose.model("feedbacks", Feedback);