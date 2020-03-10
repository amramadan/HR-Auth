const express = require("express");
const bodyParser = require("body-parser");


// config the app
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Include all files in routes folder
// call them and
// =============================================================================
require("fs")
  .readdirSync("./routes")
  .map(file => {
    const injectRoute = require("./routes/" + file);

    //The check is commented out to give an exception if this problem occurs
    if (typeof injectRoute === "function") {
      console.log("Binding Route:" + file);
      injectRoute(app);
    } else {
      throw file + " must export a function that take app as argument";
    }
  });



// 404 handling
// =============================================================================
app.use(function (req, res, next) {
  res.status(404).send({ error: "not found" });
});

// Error handling
// =============================================================================
app.use(function (err, _req, res, _next) {
    if (err.status)
        res.status(err.status);
    else
        res.status(err.error.code);

    if (!!!err.error.code) {
        res.send("something bad happened");
    }
    res.send({ error: err.error });
});

module.exports = app;
