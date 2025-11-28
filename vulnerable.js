/**
 * Arquivo JavaScript com vulnerabilidades intencionais para demonstração SAST
 * NÃO USE EM PRODUÇÃO!
 */

// VULNERABILIDADE: Hardcoded credentials
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "admin123";
const SECRET_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// VULNERABILIDADE: SQL Injection
function getUser(userId) {
    const query = "SELECT * FROM users WHERE id = " + userId;
    return db.execute(query);
}

// VULNERABILIDADE: Command Injection
const { exec } = require('child_process');
function ping(host) {
    exec('ping -c 1 ' + host, (error, stdout) => {
        console.log(stdout);
    });
}

// VULNERABILIDADE: Eval com input do usuário
function calculate(expression) {
    return eval(expression);
}

// VULNERABILIDADE: XSS - innerHTML com input não sanitizado
function displayMessage(userInput) {
    document.getElementById('output').innerHTML = userInput;
}

// VULNERABILIDADE: Weak crypto
const crypto = require('crypto');
function hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

module.exports = { getUser, ping, calculate, displayMessage, hashPassword };
