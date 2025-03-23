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
