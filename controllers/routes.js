// Import Dependencies
const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");

// Import Mongoose Schemas
const db = require("../models");

// Configure Router
const router = express.Router();

// Render page on initial load
router.get("/", (req, res) => {
    return res.render("index");
});

// Read all saved articles and send to client
router.get("/articles", (req, res) => {
    db.Article.find().sort({
        _id: -1
    }).then(dbArticle => {
        return res.render("saved", { article: dbArticle });
    }).catch(error => res.json(error));
});

// Scrape Articles
router.get("/scrape", (req, res) => {

    // Scrape NFL.com
    axios.get("http://www.nfl.com").then(response => {

        // Use Cheerio to save webpage content
        const $ = cheerio.load(response.data);

        const articles = $("a.rmq-1e932717");
        const results = [];

        // Scrape page for 'a' elements with specified class
        articles.each((i, element) => {

            const article = {
                title: $(element).attr("data-metrics-link-name"),
                link: $(element).attr("data-metrics-link-url")
            };
            // article.title.attr("id", )
            results.push(article);

        });
        console.log("Scrape Complete!");
        return res.render("index", { article: results });
    });
});

// Read a note for articles referenced by ID
router.get("/comments/:id", (req, res) => {
    // console.log(req.params.id);
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        // .then(dbArticle => res.json(dbArticle.note))
        // .then(dbArticle => console.log(dbArticle.note))
        .then(dbArticle => { return res.json(dbArticle) })
        .catch(error => { return res.json(error) });
});

// Save article to database
router.post("/api/saved/", (req, res) => {
    const article = req.body;
    // Update database with scraped articles
    db.Article.updateMany(
        {
            title: article.title,
            link: article.link
        },
        {
            $set: {
                title: article.title,
                link: article.link
            }
        },
        { upsert: true })
        .then(result => {
            // console.log("Added new article.");
            console.log(result);
        })
        .catch(err => console.log(err));
    return res.send("Updated.");
});

// Delete an article from database
router.post("/api/delete/article", (req, res) => {
    const articleID = req.body.id;
    console.log(articleID);
    db.Article.deleteOne({ _id: `${articleID}` }, () => {
        return res.send("Article Deleted");
    });
});

// Create a note and add to database
router.post("/api/articles/", (req, res) => {
    const articleID = req.body.id;
    const comment = {
        title: req.body.title,
        body: req.body.body
    }
    console.log(`Article ID: ${articleID}`);
    console.log(`Comment: ${comment}`);

    db.Note.create(comment)
        .then(dbNote => db.Article.findOneAndUpdate({
            _id: articleID
        },
            { note: dbNote._id }, { new: true }))
        .then(() => res.redirect("/articles"))
        .catch(error => { return res.json(error) });


});

// Delete a note from database
router.post("/api/delete/note", (req, res) => {
    const noteID = req.body.id;
    console.log(noteID);
    db.Note.deleteOne({ _id: `${noteID}` }, () => {
        console.log("Note deleted.");
    });
    res.redirect("/articles");
});

// Export Routes
module.exports = router;