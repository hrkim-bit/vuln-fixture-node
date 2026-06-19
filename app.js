const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const utils = require("./src/utils");

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
function handlePing(req, res) {
  const host = req.query.host || "localhost";
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.send(stdout);
  });
}

// SQL Injection
function handleUser(req, res) {
  const id = req.query.id;
  db.query("SELECT * FROM users WHERE id = " + id, (err, rows) => {
    res.json({ rows });
  });
}

// NoSQL-style injection — user object used directly
function handleLogin(req, res) {
  const query = { username: req.body.username, password: req.body.password };
  db.query("SELECT * FROM users WHERE username = '" + query.username + "'", (err, rows) => {
    res.json({ rows });
  });
}

// Path Traversal
function handleFile(req, res) {
  const name = req.query.name || "";
  fs.readFile(path.join("/var/data", name), "utf8", (err, data) => {
    res.send(data);
  });
}

// SSRF
async function handleFetch(req, res) {
  const url = req.query.url;
  const resp = await axios.get(url);
  res.send(resp.data);
}

// Code Injection
function handleCalc(req, res) {
  const expr = req.query.expr || "0";
  res.send(String(eval(expr)));
}

// Weak hash
function handleHash(req, res) {
  const pw = req.query.pw || "";
  res.send(crypto.createHash("md5").update(pw).digest("hex"));
}

// JWT verify without algorithm pinning
function handleWhoami(req, res) {
  const token = req.query.token || "";
  const decoded = jwt.verify(token, JWT_SECRET);
  res.json(decoded);
}

function handleMerge(req, res) {
  const source = req.body || {};
  res.json(utils.merge({}, source));
}

function handleExtract(req, res) {
  const archive = req.query.path || "";
  res.send(utils.extract(archive));
}

function handleUtilsHash(req, res) {
  const pw = req.query.pw || "";
  res.send(utils.insecureHash(pw));
}

function handleGenToken(req, res) {
  res.send(utils.genToken());
}

app.get("/ping", handlePing);
app.get("/user", handleUser);
app.post("/login", handleLogin);
app.get("/file", handleFile);
app.get("/fetch", handleFetch);
app.get("/calc", handleCalc);
app.get("/hash", handleHash);
app.get("/whoami", handleWhoami);
app.post("/merge", handleMerge);
app.get("/extract", handleExtract);
app.get("/utils-hash", handleUtilsHash);
app.get("/token", handleGenToken);

app.listen(3000, "0.0.0.0", () => {
  console.log("listening on 0.0.0.0:3000");
});
