# URL Shortener Service

This project is a URL Shortener service built using Node.js, Express, and PostgreSQL. It allows you to shorten long URLs, redirect users using the shortened URL, and fetch usage statistics for each short URL.

---

## Brief Explanation of the Approach

The project comprises three main layers:

- **Database Layer (PostgreSQL):**
  - **Mapping:** Stores the mapping of `shortId` to `redirectURL`.
  - **Tracking:** Maintains a `visitCount` for the number of times each short URL is visited.

- **Backend Layer (Node.js + Express):**
  - **Routes:** Handle incoming HTTP requests and map them to specific controllers.
  - **Controllers:** Contain the logic for generating short URLs, redirecting users, and fetching statistics.
  - **Models:** Interact directly with PostgreSQL using SQL queries.

- **API Layer:**
  - Exposes REST APIs to:
    - **Shorten a URL:** Create a short URL.
    - **Get URL stats:** Retrieve the number of visits for a short URL.
    - **Redirect:** Redirect the user when a shortened URL is accessed.

---

## Flow of the Application

### Shortening a URL

- **Input:** JSON body with:
  - `url`: the long URL
  - `alias` (optional): a user-defined short ID
- **Process:**
  - If the long URL already exists, return the existing short ID.
  - If an alias is provided, check if it’s already used. If yes, return an error.
  - If no alias is provided, generate a short ID using the SHA-256 hash of the URL.
  - Store `(shortId, redirectURL, visitCount)` in PostgreSQL.
- **Output:** Returns a short URL (e.g., `http://localhost:8001/abc123`).

### Redirecting to the Original URL (`GET /:shortId`)

- **Input:** `shortId` from the URL.
- **Process:**
  - Look up `shortId` in PostgreSQL.
  - If found, increment `visitCount`.
  - Redirect the user to the `redirectURL`.
- **Output:** HTTP Redirect (302) to the original long URL.

### Fetching Stats (`GET /url/stats/:shortId`)

- **Input:** `shortId`.
- **Process:**
  - Query the database for the `visitCount` associated with the given `shortId`.
  - If not found, return a 404 error.
- **Output:** Returns the number of visits (e.g., `{ "visitCount": 10 }`).

---

## Steps to Run the Project Locally

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd node-url-shortener
```

### 2.  Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL Database
- Ensure PostgreSQL is installed and running.
- Create the database and table:
  ```sql
  CREATE DATABASE url_shortner;
  CREATE TABLE url_shortner.urls (
    id INT PRIMARY KEY,
    shortId VARCHAR(255) UNIQUE NOT NULL,
    redirectURL VARCHAR(255) NOT NULL,
    visitCount INT DEFAULT 0
  );
  ```
### 4. Configure Database Connection (connect.js)

Update the connect.js file with your PostgreSQL credentials:
```js
const { Pool } = require('pg');
const connection = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'url_shortner',
  password: 'your_pg_password',
  port: 5432
});
module.exports = { connection };
```
### 5. Start the Server
When you run the project on your local server, you need to update the url.js
file inside the controllers folder wherever the URL:
[https://givaassignment-production.up.railway.app] is mentioned (appears 3 times), you must replace it with your local server
address
```bash
npm run test # if nodemon setup, else
node index.js
```
Server runs on [http://localhost:8001]

## URL Shortener - API Request and Response Examples
### 1. If the long URL already exists, return the existing short ID
Request
  ```http
  POST /url
  Content-Type: application/json
  {
  "url": "https://www.example.com",
  "alias": "something"  // optional
  }
  ```
  Response (200 OK)
```json
{
 "id": "abc123",
 "shortUrl": "http://localhost:8001/abc123",
 "message": "Short ID already exists for this URL"
}
```
Here even if we provide the alias it don’t matter because the
short URL for given URL already exists .
### 2. If alias is provided, check if it’s already used. If yes, return an error
Request:
```json
{
 "url": "https://www.anotherexample.com",
 "alias": "customAlias"
}
```
Response if alias is already used (400 Bad Request):
```json
{
 "error": "Alias already in use. Choose a different one."
}
```
Response if alias is available (200 OK):
```json
{
 "id": "customAlias",
 "shortUrl": "http://localhost:8001/customAlias"
}
```
### 3. If no alias is provided, generate a short ID using SHA-256 hash of the URL
Request:
```json
{
 "url": “https://www.newwebsite.com”,
 "alias": ""
}
```
Response (200 OK):
```json
{
 "id": "a1b2c3",
 "shortUrl": "http://localhost:8001/a1b2c3"
}
```
### 4. Get the stats for a short URL
Request:
```http
GET /url/stats/a1b2c3
```
Response (200 OK):
```json
{
 "visitCount": 10
}
```
