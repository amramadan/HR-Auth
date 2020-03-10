const PORT = process.env.PORT || 3030; // set our port
const startup = require("./db/config");
const app = require("./index.js");

app.listen(PORT, () => {
  // Middlewares
  // =============================================================================
  console.log(`app listening on port ${PORT}!'`);

  // connect to mongodb
  startup();
});