const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const config = require("./config.json");
const uri = config.uri;

const app = express();
require("./startup/loadProdModules")(app);
const connectToDB = require("./startup/connectToDB");

app.get("/", (req, res) => {
    res.send("hello fake news quiz api");
});

app.get("/api/randomArticles/:num", async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("/api/randomArticles/:num");
    console.log(parseInt(req.params.num));

    try {
        await client.connect();
        const collection = await client
            .db("database1")
            .collection("article-9-24");

        const result = await collection.aggregate([
            { $sample: { size: parseInt(req.params.num) } },
        ]);
        const articlesArray = [];
        await result.forEach((doc) => {
            articlesArray.push(doc);
        });
        // console.log("articlesArray", articlesArray);
        res.send(articlesArray);
    } catch (err) {
        console.log("err", err);
    } finally {
        await client.close();
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
