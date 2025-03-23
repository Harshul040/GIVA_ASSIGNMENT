
const crypto = require("crypto");
const connection = require("../connect").connection;

async function handleGenerate(req, res) {
    const { url, alias } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const urlCheckQuery = "SELECT shortId FROM url_shortner.urls WHERE redirectURL = $1";
        const urlCheckResult = await connection.query(urlCheckQuery, [url]);

        if (urlCheckResult.rows.length > 0) {
            return res.json({
                id: urlCheckResult.rows[0].shortid,
                shortUrl: `http://localhost:8001/${urlCheckResult.rows[0].shortid}`,
                message: "Short ID already exists for this URL"
            });
        }

       
        let shortID = alias || crypto.createHash("sha256").update(url).digest("hex").substring(0, 6);

        const checkQuery = "SELECT shortId FROM url_shortner.urls WHERE shortId = $1";
        const checkResult = await connection.query(checkQuery, [shortID]);

        if (checkResult.rows.length > 0) {
            if (alias) {
                return res.status(400).json({ error: "Alias already in use. Choose a different one." });
            } else {
                return res.json({ id: shortID, shortUrl: `http://localhost:8001/${shortID}` });
            }
        }

        await insertURL(shortID, url, res);
    } catch (error) {
        console.error("Error in handleGenerate:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function insertURL(shortId, url, res) {
    try {
        const insertQuery = "INSERT INTO url_shortner.urls (shortId, redirectURL, visitCount) VALUES ($1, $2, 0)";
        await connection.query(insertQuery, [shortId, url]);
        res.json({ id: shortId, shortUrl: `http://localhost:8001/${shortId}` });
    } catch (error) {
        console.error("Error inserting URL:", error);
        res.status(500).json({ error: "Database error" });
    }
}

async function handleStats(req, res) {
    const shortId = req.params.shortId;
    try {
        const query = "SELECT visitCount FROM url_shortner.urls WHERE shortId = $1";
        const results = await connection.query(query, [shortId]);

        if (results.rows.length === 0) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.json({ visitCount: results.rows[0].visitcount });
    } catch (err) {
        console.error("Error fetching visit count:", err);
        return res.status(500).json({ error: "Database error" });
    }
}

module.exports = {
    handleGenerate,
    handleStats
};

