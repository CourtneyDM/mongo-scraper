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
const PORT = process.env.PORT || 3000;

// Establish Mongoose Connection to DB
// mongoose.connect("mongodb://localhost/articleScraper");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_d9w0fw1n:8g7v130pig6pvqp81gat0r1mks@ds159840.mlab.com:59840/heroku_d9w0fw1n";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

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

// Start Server...
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}...`));