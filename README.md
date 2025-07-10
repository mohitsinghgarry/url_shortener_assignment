# 🔗 Mini URL Shortener API

A TypeScript-powered URL Shortener REST API using **Node.js**, **Express**, and **MongoDB**. Easily convert long URLs into short, shareable links with analytics, validation, and optional expiration features.

```

## 📁 Project Structure

| Path                        | Description                                  |
|-----------------------------|----------------------------------------------|
| `dist/`                     | Compiled JavaScript files (after build)     |
| `node_modules/`             | Installed project dependencies               |
| `public/`                   | Optional frontend files (UI)                 |
| ├── `css/style.css`         | Styling for frontend                         |
| ├── `js/script.js`          | Client-side JavaScript                       |
| └── `index.html`            | Frontend entry point                         |
| `src/`                      | Main source code directory                   |
| ├── `config/`               | Database and environment configuration       |
| ├── `controllers/`          | Express route handlers                       |
| ├── `models/`               | Mongoose schemas and models                  |
| ├── `routes/`               | API route definitions                        |
| ├── `utils/`                | Utility functions (e.g., URL validator)      |
| └── `app.ts`                | Express server entry point                   |
| `.env`                      | Environment variables file                   |
| `.gitignore`                | Git ignored files and folders                |
| `package.json`              | Project metadata and scripts                 |
| `package-lock.json`         | NPM dependency lockfile                      |
| `tsconfig.json`             | TypeScript compiler configuration            |

```
## 🚀 Features

- 🔗 Shortens any valid long URL
- 🔁 Redirects using short codes (`GET /:code`)
- 🧠 Validates URLs before shortening
- ⌛ Optional: Expiry date for short links
- 📈 Optional: Tracks number of visits
- 🧱 Built with modular TypeScript project structure

## 🔌 API Endpoints

### 📍 POST `/shorten`
Create a short link from a long URL.

**Request**
```json
{
  "url": "https://example.com/very/long/url"
}
````

**Response**

```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

### 📍 GET `/:code`

Redirect to the original URL.

**Request**

```
GET /abc123
```

**Response**

```
302 Redirect to original long URL
```

---

## 🧪 Environment Setup

### 📁 Create `.env` File

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:3000
```

---

## 🛠️ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mohitsinghgarry/url_shortener_assignment.git
cd url_shortener_assignment
npm install
```

### 2. Build & Run

```bash
# Build TypeScript
npm run build

# Start the server
npm start
```

Server starts on: `http://localhost:3000`

---

## 💡 Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Run in dev mode using ts-node    |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start`     | Run the compiled app             |

---

## 🧠 Optional Enhancements

* ✅ Rate Limiting (via middleware like `express-rate-limit`)
* 📆 Expiration logic (auto-expire URLs after date)
* 📊 Analytics tracking (click count, referrer, etc.)
* 🔐 User authentication (JWT-based)

---

## 📬 Testing

You can use **Postman** or **cURL** to test endpoints.

Example:

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com"}'
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mohit Singh**
Final Year B.Tech | Full Stack Developer
[GitHub](https://github.com/mohitsinghgarry) • [LinkedIn](https://www.linkedin.com/in/mohit-singh-95a883225/)

---

```

---

Let me know if you'd like me to:
- Generate `.env.example`
- Write your `src/app.ts` setup
- Add `mongoose` connection boilerplate
- Create a sample Postman Collection JSON

Would you like to push this to GitHub and need help writing the commit message or `.gitignore`?
```
