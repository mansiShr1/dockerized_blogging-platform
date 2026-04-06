const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "db",
  user: "root",
  password: "root",
  database: "blogdb"
});

// ✅ STRONG retry logic (won't crash)
function connectDB() {
  db.connect((err) => {
    if (err) {
      console.log("⏳ Waiting for DB...");
      setTimeout(connectDB, 3000);
    } else {
      console.log("✅ MySQL Connected!");
    }
  });
}
connectDB();

// ✅ ROUTES

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts", (err, result) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }
    res.json(result);
  });
});

app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  db.query(
    "INSERT INTO posts (title, content) VALUES (?, ?)",
    [title, content],
    (err) => {
      if (err) return res.json({ error: err });
      res.json({ message: "Post created" });
    }
  );
});

app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE posts SET title=?, content=? WHERE id=?",
    [title, content, id],
    (err) => {
      if (err) return res.json({ error: err });
      res.json({ message: "Updated" });
    }
  );
});

app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM posts WHERE id=?", [id], (err) => {
    if (err) return res.json({ error: err });
    res.json({ message: "Deleted" });
  });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Server running on port 5000");
});