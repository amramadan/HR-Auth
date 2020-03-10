async function startup() {
  const db = require("./mongodb.config.js");
  try {
    let dbconnect = await db.connect();    
  } catch (error) {
    console.log("Couldn't connect to DB");
  }
}

module.exports = startup;
