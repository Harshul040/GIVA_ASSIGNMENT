const express = require("express");
const { connection } = require("./connect");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8001;

app.use(express.json());
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        
        const result = await connection.query("SELECT * FROM url_shortner.urls WHERE shortid = $1", [shortId]);//change
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        const entry = result.rows[0];

        await connection.query("UPDATE url_shortner.urls SET visitcount = visitcount + 1 WHERE shortid = $1", [shortId]);

        res.redirect(entry.redirecturl);
    } catch (err) {
        console.error("Error fetching URL:", err);
        res.status(500).json({ error: "Database error 1" });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

