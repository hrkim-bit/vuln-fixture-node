const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const app = express();
app.use(express.json());

// Hardcoded fake secrets
const JWT_SECRET = "django-insecure-do-not-use-0000000000";
const DB_PASSWORD = "Pa55w0rd!";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

const db = mysql.createConnection({
  host: "db.internal",
  user: "admin",
  password: DB_PASSWORD,
  database: "prod",
});

// Command Injection
app.get("/ping", (req, res) => {
  const host = req.query.host || "localhost";
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.send(stdout);
  });
});

// SQL Injection
app.get("/user", (req, res) => {
  const id = req.query.id;
  db.query("SELECT * FROM users WHERE id = " + id, (err, rows) => {
    res.json({ rows });
  });
});

// NoSQL-style injection — user object used directly
app.post("/login", (req, res) => {
  const query = { username: req.body.username, password: req.body.password };
  db.query("SELECT * FROM users WHERE username = '" + query.username + "'", (err, rows) => {
    res.json({ rows });
  });
});

// Path Traversal
app.get("/file", (req, res) => {
  const name = req.query.name || "";
  fs.readFile(path.join("/var/data", name), "utf8", (err, data) => {
    res.send(data);
  });
});

// SSRF
app.get("/fetch", async (req, res) => {
  const url = req.query.url;
  const resp = await axios.get(url);
  res.send(resp.data);
});

// Code Injection
app.get("/calc", (req, res) => {
  const expr = req.query.expr || "0";
  res.send(String(eval(expr)));
});

// Weak hash
app.get("/hash", (req, res) => {
  const pw = req.query.pw || "";
  res.send(crypto.createHash("md5").update(pw).digest("hex"));
});

// JWT verify without algorithm pinning
app.get("/whoami", (req, res) => {
  const token = req.query.token || "";
  const decoded = jwt.verify(token, JWT_SECRET);
  res.json(decoded);
});

app.listen(3000, "0.0.0.0", () => {
  console.log("listening on 0.0.0.0:3000");
});
