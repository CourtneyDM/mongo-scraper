const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const request = require("request");

const database = require("./models");
const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/articleScraper");

app.get("/articles", (req, res) => {
    database.Article.find().sort({
        _id: -1
    })
        .then(dbArticle => res.json(dbArticle))
        .catch(error => res.json(error));
});

// Route to run when "Scrape Articles" button is clicked
app.get("/scrape", (req, res) => {
    request("http://www.nfl.com", (err, response, body) => {
        // console.log(response);

        const $ = cheerio.load(body);

        $("a.rmq-1e932717").each((i, element) => {
            const article = {
                title: $(element).text(),
                link: $(element).attr("data-metrics-link-url")
            };
            database.Article.update(
                { title: article.title },
                {
                    $set: {
                        title: article.title,
                        link: article.link
                    }
                },
                { upsert: true })
                .then(result => {
                    // res.send("Scrape Completed");
                    console.log(JSON.stringify(result, null, 2));
                })
                .catch(err => console.log(err));
        });
        console.log("Scrape Complete!");

    });
});

app.get("/articles/:id", (req, res) => {
    database.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbArticle => res.json(dbArticle))
        .catch(error => res.json(error));
});

app.post("/articles/:id", (req, res) => {
    database.Note.create(req.body)
        .then(dbNote => dbArticle.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })).
        then(dbArticle => res.json(dbArticle))
        .catch(error => res.json(error));
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}...`));