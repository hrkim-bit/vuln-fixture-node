const crypto = require("crypto");
const { execSync } = require("child_process");

const HARDCODED_TOKEN = "ghp_CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC2222";

// Prototype Pollution — recursive merge with no key guard
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Weak hash
function insecureHash(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

// Command Injection
function extract(userInput) {
  return execSync("tar xzf " + userInput);
}

// Insecure randomness for token generation
function genToken() {
  return Math.random().toString(36).slice(2);
}

module.exports = { merge, insecureHash, extract, genToken, HARDCODED_TOKEN };
