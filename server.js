// Import Dependencies
const bodyParser = require("body-parser");
const express = require("express");
const handlebars = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./controllers/routes");

// Configure Express
const app = express();

// Configure PORT
const PORT = 3000;

// Configure BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Static Pages
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

// Configure Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure Morgan for CLI Logging
app.use(logger("dev"));

// Establish Mongoose Connection to DB
mongoose.connect("mongodb://localhost/articleScraper");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Start Server...
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}...`));