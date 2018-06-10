// Include Mongoose dependency
const mongoose = require("mongoose");

// Create a reference to the Mongoose Schema constructor
const Schema = mongoose.Schema;

// Create the Article Schema object
const ArticleSchema = new Schema({
    // Article's title is required
    title: {
        type: String,
        required: true
    },
    // Article's link is required
    link: {
        type: String,
        required: true
    },
    // Create a link to the Note model referencing the Note's ObjectID
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// Create the Article model using the Mongoose Schema above
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;