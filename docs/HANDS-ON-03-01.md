# 🎬 Vídeo 3.1 - SAST com Horusec

**Aula**: 3 - SAST, SCA e SBOM  
**Vídeo**: 3.1  
**Temas**: Shift-Left Security; SAST (Static Application Security Testing); Horusec; Detecção de vulnerabilidades no código

---

## 🚀 Antes de Começar

### Pré-requisitos

| Requisito | Como verificar |
|-----------|----------------|
| Git instalado | `git --version` |
| Docker instalado | `docker --version` |
| Conta GitHub | Acesso ao github.com |

### Primeira vez?
→ Faça fork do repositório `fiap-dclt-devsecops-aula03` para sua conta GitHub

---

## 📚 Parte 1: Conceitos Fundamentais

### Passo 1: O que é Shift-Left?

```mermaid
graph LR
    subgraph "Tradicional (Shift-Right)"
        A1[Design] --> B1[Dev] --> C1[Build] --> D1[Deploy] --> E1[🔒 Security]
    end
```

```mermaid
graph LR
    subgraph "DevSecOps (Shift-Left)"
        A2[🔒 Design] --> B2[🔒 Dev] --> C2[🔒 Build] --> D2[🔒 Deploy] --> E2[Ops]
    end
```

**Por que Shift-Left?**

| Quando encontra | Custo para corrigir |
|-----------------|---------------------|
| Design | $1 |
| Desenvolvimento | $10 |
| Testes | $100 |
| Produção | $1.000+ |

> **Quanto mais cedo encontrar, mais barato corrigir!**

---

### Passo 2: SAST vs SCA - Qual a diferença?

| Aspecto | SAST | SCA |
|---------|------|-----|
| **Significado** | Static Application Security Testing | Software Composition Analysis |
| **O que analisa** | SEU código fonte | Bibliotecas de terceiros |
| **Detecta** | SQL Injection, XSS, hardcoded secrets | CVEs em dependências |
| **Ferramenta** | Horusec, Semgrep, SonarQube | Trivy, Snyk, Dependabot |

```mermaid
graph TB
    A[Sua Aplicação] --> B[app.py - SEU CÓDIGO]
    A --> C[requirements.txt - DEPENDÊNCIAS]
    
    B --> D[SAST - Horusec]
    C --> E[SCA - Trivy]
```

---

### Passo 3: O que é CVE?

**CVE** = Common Vulnerabilities and Exposures

- Identificador único para vulnerabilidades conhecidas
- Formato: `CVE-YYYY-NNNNN`
- Mantido pelo MITRE Corporation
- Banco de dados: [cve.org](https://cve.org)

**Exemplos famosos:**

| CVE | Nome | O que foi |
|-----|------|-----------|
| CVE-2021-44228 | **Log4Shell** | RCE no Log4j, afetou milhões de sistemas |
| CVE-2014-0160 | **Heartbleed** | Vazamento de memória no OpenSSL |
| CVE-2017-5638 | **Struts** | RCE no Apache Struts (Equifax breach) |

---

### Passo 4: O que é Horusec?

**Horusec** = Ferramenta SAST open source brasileira (ZUP)

**Características:**
- Multi-linguagem (Python, JavaScript, Go, Java, etc.)
- Detecta 20+ tipos de vulnerabilidades
- Fácil integração com CI/CD
- Relatórios em JSON, SARIF, texto

**O que detecta:**
- SQL Injection
- XSS (Cross-Site Scripting)
- Command Injection
- Hardcoded Secrets
- Insecure Crypto
- Path Traversal

---

## 🍴 Parte 2: Configurar Repositório

### Passo 5: Fork e Clone

1. Acesse: `https://github.com/josenetoo/fiap-dclt-devsecops-aula03`
2. Clique em **Fork**
3. Clone seu fork:

**Linux/Mac:**
```bash
cd ~/fiap-devsecops
git clone https://github.com/josenetoo/fiap-dclt-devsecops-aula03.git
cd fiap-dclt-devsecops-aula03
ls -la
```

**Windows (PowerShell):**
```powershell
cd ~\fiap-devsecops
git clone https://github.com/josenetoo/fiap-dclt-devsecops-aula03.git
cd fiap-dclt-devsecops-aula03
Get-ChildItem
```

**Estrutura esperada:**
```
fiap-dclt-devsecops-aula03/
├── app.py                ← Código com vulnerabilidades intencionais
├── requirements.txt      ← Dependências (algumas vulneráveis)
├── Dockerfile
├── horusec-config.json   ← Configuração do Horusec
├── .trivyignore          ← Exceções do Trivy
└── docs/
```

---

## 🔍 Parte 3: Executar SAST com Horusec

### Passo 6: Instalar Horusec

**Mac:**
```bash
# Baixar binário
curl -fsSL https://github.com/ZupIT/horusec/releases/latest/download/horusec_mac_amd64 -o horusec
chmod +x horusec
sudo mv horusec /usr/local/bin/

# Verificar instalação
horusec version
```

**Linux:**
```bash
# Via script oficial
curl -fsSL https://raw.githubusercontent.com/ZupIT/horusec/main/deployments/scripts/install.sh | bash

# Verificar instalação
horusec version
```

**Windows (PowerShell):**
```powershell
# Baixar executável
Invoke-WebRequest -Uri "https://github.com/ZupIT/horusec/releases/latest/download/horusec_win_amd64.exe" -OutFile "horusec.exe"

# Mover para PATH ou usar diretamente
.\horusec.exe version
```

**Alternativa (Docker) - Funciona em qualquer OS:**
```bash
# Rodar via Docker (não precisa instalar)
docker run -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/src horuszup/horusec-cli:latest \
  horusec start -p /src
```

---

### Passo 7: Executar Scan Local

```bash
cd ~/fiap-devsecops/fiap-dclt-devsecops-aula03

# Scan básico
horusec start -p .

# Scan com output JSON
horusec start -p . -o json -O horusec-results.json

# Ignorar severidades baixas
horusec start -p . --ignore-severity LOW
```

**Windows (PowerShell):**
```powershell
cd ~\fiap-devsecops\fiap-dclt-devsecops-aula03
horusec start -p .
```

---

### Passo 8: Analisar Resultados

**Resultado esperado (Horusec):**

```
Language: Leaks
Severity: CRITICAL
File: app.js
Line: 31
Code: const API_KEY = "sk-1234567890abcdef";
Details: Hard-coded credential detected (CWE-798)

Language: Leaks
Severity: CRITICAL
File: app.js
Line: 32
Code: const DB_PASSWORD = "admin123";
Details: Hard-coded password detected (CWE-798)

Language: JavaScript
Severity: CRITICAL
File: app.js
Line: 118
Code: const result = eval(expression);
Details: No use eval - Remote Code Execution risk (CWE-94)

Language: JavaScript
Severity: HIGH
File: app.js
Line: 132
Code: const hash = crypto.createHash('md5').update(text).digest('hex');
Details: No use MD5 hashing - Weak cryptography (CWE-327)

Language: JavaScript
Severity: HIGH
File: app.js
Line: 88
Code: exec('ping -c 1 ' + host, ...)
Details: Command Injection risk (CWE-78)

==================================================================================
Total: 5 vulnerabilities (CRITICAL: 3, HIGH: 2)
```

---

### Passo 9: Entender as Vulnerabilidades

Abra o `app.js` e localize:

**1. Hardcoded Credentials (CRITICAL):**
```javascript
// Linha 31-34 ❌ VULNERÁVEL
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "admin123";

// ✅ CORRIGIDO - Use variáveis de ambiente
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

**2. Eval - Remote Code Execution (CRITICAL):**
```javascript
// Linha 118 ❌ VULNERÁVEL
const result = eval(expression);

// ✅ CORRIGIDO - Use biblioteca segura
const mathjs = require('mathjs');
const result = mathjs.evaluate(expression);
```

**3. Command Injection (HIGH):**
```javascript
// Linha 88 ❌ VULNERÁVEL
exec('ping -c 1 ' + host, callback);

// ✅ CORRIGIDO - Use execFile com argumentos separados
const { execFile } = require('child_process');
execFile('ping', ['-c', '1', host], callback);
```

**4. Criptografia Fraca - MD5 (HIGH):**
```javascript
// Linha 132 ❌ VULNERÁVEL
crypto.createHash('md5').update(text).digest('hex');

// ✅ CORRIGIDO - Use SHA-256 ou bcrypt
crypto.createHash('sha256').update(text).digest('hex');
```

---

## 🔄 Parte 4: Adicionar ao Pipeline

### Passo 10: Criar Job Horusec

**Linux/Mac:**
```bash
cd ~/fiap-devsecops/fiap-dclt-devsecops-aula03
mkdir -p .github/workflows

cat > .github/workflows/security.yml << 'EOF'
# ============================================
# WORKFLOW: Security Scanning (SAST + SCA)
# ============================================
name: 🔒 Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ============================================
  # JOB: SAST com Horusec
  # ============================================
  horusec:
    name: 🔍 SAST - Horusec
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🔍 Run Horusec
        uses: fike/horusec-action@v0.2.2
        with:
          arguments: >
            -p ./
            -o json
            -O horusec-results.json
            --ignore-severity LOW

      - name: 📤 Upload Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: horusec-report
          path: horusec-results.json
          retention-days: 30
EOF
```

**Windows (PowerShell):**
```powershell
cd ~\fiap-devsecops\fiap-dclt-devsecops-aula03
New-Item -ItemType Directory -Force -Path .github/workflows

@'
name: 🔒 Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  horusec:
    name: 🔍 SAST - Horusec
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🔍 Run Horusec
        uses: fike/horusec-action@v0.2.2
        with:
          arguments: >
            -p ./
            -o json
            -O horusec-results.json
            --ignore-severity LOW

      - name: 📤 Upload Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: horusec-report
          path: horusec-results.json
          retention-days: 30
'@ | Out-File -FilePath .github/workflows/security.yml -Encoding UTF8
```

---

### Passo 11: Commit e Push

**Linux/Mac:**
```bash
git add .github/workflows/security.yml
git commit -m "feat: adicionar SAST com Horusec"
git push origin main
```

**Windows (PowerShell):**
```powershell
git add .github/workflows/security.yml
git commit -m "feat: adicionar SAST com Horusec"
git push origin main
```

---

### Passo 12: Verificar Execução

1. GitHub > **Actions**
2. Clique no workflow **Security Scan**
3. Baixe o artifact `horusec-report`

**Resultado esperado:**
```
✅ SAST - Horusec (completed with findings)
📦 Artifact: horusec-report.json
```

---

## 🔧 Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `horusec: command not found` | Não instalado | Usar via Docker |
| Scan muito lento | Projeto grande | Usar `--ignore` para diretórios |
| Muitos falsos positivos | Sensibilidade alta | Usar `--ignore-severity LOW` |

---

## ✅ Checkpoint

Ao final deste vídeo você deve ter:

- [ ] Entender diferença entre SAST e SCA
- [ ] Saber o que é CVE
- [ ] Horusec instalado ou rodando via Docker
- [ ] Scan local executado com sucesso
- [ ] Identificado vulnerabilidades no código
- [ ] Job Horusec no pipeline

---

**FIM DO VÍDEO 3.1** ✅
