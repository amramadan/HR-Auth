const mongoose = require("mongoose");
const database = {
  development: "mongodb://localhost:27017/auth",
  production: "mongodb://localhost:27017/auth",
  default: "mongodb://mongo:27017/auth"
};

mongoose.Promise = Promise;

module.exports = {
  mongoose,
  connect: () =>
    mongoose
      .connect(database[process.env.NODE_ENV] || database.default, {
        useCreateIndex: true,
        useNewUrlParser: true
      })
      .then(() => {
        console.log({
          env: process.env.NODE_ENV,
          address: database[process.env.NODE_ENV],
          mongooseReadyState: mongoose.connection.readyState
        });
      })
      .catch(err => {
        console.log({
          Database: "Unable to establish Connection",
          Code: 500,
          env: process.env.NODE_ENV,
          address: database[process.env.NODE_ENV],
          error: err.stack
        });
      }),
  disconnect: done => mongoose.disconnect(done)
};
