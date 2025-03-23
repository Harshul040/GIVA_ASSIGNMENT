
const connection = require("../connect").connection;

const createURL = async (shortId, redirectURL) => {
    const query = "INSERT INTO url_shortner.urls (shortId, redirectURL, visitCount) VALUES ($1, $2, 0)";
    await connection.query(query, [shortId, redirectURL]);
};

module.exports = { createURL };

