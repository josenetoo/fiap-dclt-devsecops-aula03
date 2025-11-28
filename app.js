/**
 * ============================================
 * APLICAÇÃO VULNERÁVEL PARA DEMONSTRAÇÃO
 * ============================================
 * 
 * ⚠️  ATENÇÃO: Este código contém vulnerabilidades INTENCIONAIS
 *     para fins educacionais. NÃO USE EM PRODUÇÃO!
 * 
 * Vulnerabilidades incluídas:
 * - SQL Injection
 * - Command Injection  
 * - XSS (Cross-Site Scripting)
 * - Hardcoded Credentials
 * - Eval com input do usuário
 * - Criptografia fraca (MD5)
 * - Bind em todas as interfaces
 */

const express = require('express');
const { exec } = require('child_process');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// VULNERABILIDADE: Hardcoded Credentials
// ============================================
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "admin123";
const SECRET_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const JWT_SECRET = "super-secret-key-123";

// Configuração do banco de dados
const db = new sqlite3.Database(':memory:');

// Inicializar banco com dados de teste
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)");
    db.run("INSERT INTO users VALUES (1, 'admin', 'admin123', 'admin@example.com')");
    db.run("INSERT INTO users VALUES (2, 'user', 'user123', 'user@example.com')");
});

// ============================================
// ROTA: Página inicial
// ============================================
app.get('/', (req, res) => {
    res.send(`
        <h1>🔓 Aplicação Vulnerável - Demo SAST</h1>
        <p>Esta aplicação contém vulnerabilidades intencionais para demonstração.</p>
        <h2>Endpoints disponíveis:</h2>
        <ul>
            <li><a href="/user?id=1">/user?id=1</a> - SQL Injection</li>
            <li><a href="/ping?host=localhost">/ping?host=localhost</a> - Command Injection</li>
            <li><a href="/search?q=test">/search?q=test</a> - XSS</li>
            <li><a href="/calc?expr=2+2">/calc?expr=2+2</a> - Eval Injection</li>
            <li><a href="/hash?text=password">/hash?text=password</a> - Weak Crypto</li>
        </ul>
    `);
});

// ============================================
// VULNERABILIDADE: SQL Injection
// ============================================
app.get('/user', (req, res) => {
    const userId = req.query.id;
    
    // INSEGURO: Concatenação direta de input do usuário
    const query = "SELECT * FROM users WHERE id = " + userId;
    
    db.get(query, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row || { message: 'User not found' });
    });
});

// ============================================
// VULNERABILIDADE: Command Injection
// ============================================
app.get('/ping', (req, res) => {
    const host = req.query.host;
    
    // INSEGURO: Input do usuário direto no shell
    exec('ping -c 1 ' + host, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`<pre>Error: ${stderr}</pre>`);
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

// ============================================
// VULNERABILIDADE: XSS (Cross-Site Scripting)
// ============================================
app.get('/search', (req, res) => {
    const query = req.query.q;
    
    // INSEGURO: Refletindo input sem sanitização
    res.send(`
        <h1>Resultados da busca</h1>
        <p>Você buscou por: ${query}</p>
        <p>Nenhum resultado encontrado.</p>
    `);
});

// ============================================
// VULNERABILIDADE: Eval com input do usuário
// ============================================
app.get('/calc', (req, res) => {
    const expression = req.query.expr;
    
    try {
        // INSEGURO: Eval com input do usuário (RCE)
        const result = eval(expression);
        res.json({ expression, result });
    } catch (error) {
        res.status(400).json({ error: 'Invalid expression' });
    }
});

// ============================================
// VULNERABILIDADE: Criptografia fraca (MD5)
// ============================================
app.get('/hash', (req, res) => {
    const text = req.query.text;
    
    // INSEGURO: MD5 é considerado fraco para senhas
    const hash = crypto.createHash('md5').update(text).digest('hex');
    
    res.json({ original: text, hash, algorithm: 'MD5 (INSECURE!)' });
});

// ============================================
// VULNERABILIDADE: Login com SQL Injection
// ============================================
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // INSEGURO: SQL Injection no login
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    // Log com credenciais (também vulnerável)
    console.log(`Login attempt: ${username}:${password}`);
    
    db.get(query, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 3000;

// INSEGURO: Bind em todas as interfaces + Debug info
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`API_KEY: ${API_KEY}`);  // INSEGURO: Log de credenciais
    console.log(`Environment: development`);
});

module.exports = app;
