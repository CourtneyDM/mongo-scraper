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
    res.render("index");
});

// Retrieve all saved articles and send to client
router.get("/articles", (req, res) => {
    db.Article.find().sort({
        _id: -1
    }).then(dbArticle => {
        res.render("saved", { article: dbArticle });
        console.log(dbArticle);
    }).catch(error => res.json(error));
});

// Route to run when "Scrape Articles" button is clicked
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
        res.render("index", { article: results });
    });
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
            res.send("Article saved for later!");
        })
        .catch(err => console.log(err));
    console.log(`Record saved: ${article}`);
});

// Remove an article from database
router.post("/api/delete", (req, res) => {
    const articleID = req.body.id;
    console.log(articleID);
    db.Article.deleteOne({ _id: `${articleID}` }, () => {
        console.log("Article Deleted");
    });
});

// Get notes for articles referenced by ID
router.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbArticle => res.json(dbArticle))
        .catch(error => res.json(error));
});

// Create a note for articles referenced by ID
router.post("/api/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => dbArticle.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })).
        then(dbArticle => res.json(dbArticle))
        .catch(error => res.json(error));
});

// Export Router
module.exports = router;

// TODO: Create the functionality to save a note

// TODO: Create the functionality to delete a note

