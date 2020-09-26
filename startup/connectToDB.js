const { MongoClient } = require("mongodb");
const config = require("config")

// const config = require("../config.json");
// const uri = config.uri;

module.exports = async () => {
    const client = new MongoClient(config.get("uri"), { useUnifiedTopology: true });
    await client.connect();
    console.log("connected to database!");
    return client;
};
