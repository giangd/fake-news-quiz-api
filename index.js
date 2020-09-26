const config = require("config");
const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const app = express();
require("./startup/loadProdModules")(app);

if (!config.get("uri")) {
    console.error("fatal error: uri env variable not set, can't access db");
    process.exit(1);
}

app.get("/", (req, res) => {
    res.send("hello fake news quiz api");
});

app.get("/api/randomArticles/:num", async (req, res) => {
    const client = new MongoClient(config.get("uri"), {
        useUnifiedTopology: true,
    });
    // console.log("/api/randomArticles/:num");
    // console.log(parseInt(req.params.num));

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
