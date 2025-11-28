# 🔒 Aula 03 - SAST, SCA e SBOM

> **FIAP - Pós Tech DevSecOps**

## 🎯 Objetivo

Implementar análise estática de código (SAST), análise de dependências (SCA) e geração de SBOM em pipelines CI/CD.

## 📹 Videoaulas

| Vídeo | Tema | Hands-on |
|:-----:|------|----------|
| 3.1 | **SAST com Horusec** | Detectar vulnerabilidades no código fonte |
| 3.2 | **SCA com Trivy** | Analisar dependências e bloquear por CVEs |
| 3.3 | **SBOM** | Gerar Software Bill of Materials (CycloneDX) |

## ⚙️ Pré-requisitos

| Requisito | Verificação |
|-----------|-------------|
| Git | `git --version` |
| Docker | `docker --version` |
| Aula 02 concluída | Gitleaks funcionando |

## 📁 Estrutura do Repositório

```
.
├── app.py                 # Aplicação Flask com vulnerabilidades intencionais
├── requirements.txt       # Dependências Python
├── Dockerfile             # Container da aplicação
├── horusec-config.json    # Configuração do Horusec (SAST)
├── .trivyignore           # CVEs a ignorar no Trivy (SCA)
├── .github/
│   └── workflows/         # Workflows GitHub Actions
└── docs/
    ├── HANDS-ON-03-01.md  # SAST com Horusec
    ├── HANDS-ON-03-02.md  # SCA com Trivy
    ├── HANDS-ON-03-03.md  # SBOM com CycloneDX
    └── CHEATSHEET.md      # Referência rápida
```

## 📚 Documentação

| Videoaula | Material |
|-----------|----------|
| 3.1 - SAST com Horusec | [HANDS-ON-03-01.md](docs/HANDS-ON-03-01.md) |
| 3.2 - SCA com Trivy | [HANDS-ON-03-02.md](docs/HANDS-ON-03-02.md) |
| 3.3 - SBOM | [HANDS-ON-03-03.md](docs/HANDS-ON-03-03.md) |

📋 **Referência rápida**: [Cheatsheet](docs/CHEATSHEET.md)

## 🚀 Quick Start

```bash
# Clone o repositório
git clone https://github.com/josenetoo/fiap-dclt-devsecops-aula03.git
cd fiap-dclt-devsecops-aula03

# Execute SAST com Horusec
docker run -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/src horuszup/horusec-cli:latest horusec start -p /src

# Execute SCA com Trivy
trivy fs . --severity HIGH,CRITICAL

# Gere SBOM
trivy fs . --format cyclonedx --output sbom.json
```

## 🔗 Links Úteis

- [Horusec Documentation](https://horusec.io/docs/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [CycloneDX Specification](https://cyclonedx.org/)
- [CVE Database](https://cve.org/)

---

**FIAP - Pós Tech DevSecOps** | Aula 03
