# Aula 03 - Cheatsheet

## Horusec CLI (SAST)

```bash
# Instalar (Mac arm64 - Apple Silicon)
curl -fsSL https://github.com/ZupIT/horusec/releases/latest/download/horusec_mac_arm64 -o horusec
chmod +x horusec && sudo mv horusec /usr/local/bin/

# Instalar (Mac Intel)
curl -fsSL https://github.com/ZupIT/horusec/releases/latest/download/horusec_mac_amd64 -o horusec
chmod +x horusec && sudo mv horusec /usr/local/bin/

# Instalar (Linux)
curl -fsSL https://raw.githubusercontent.com/ZupIT/horusec/main/deployments/scripts/install.sh | bash

# Scan básico
horusec start -p .

# Scan com output JSON
horusec start -p . -o json -O horusec-results.json

# Ignorar severidades baixas
horusec start -p . --ignore-severity LOW
```

## Trivy CLI

```bash
# Instalar
brew install trivy  # Mac

# Scan de filesystem (SCA)
trivy fs .

# Scan com severidade
trivy fs . --severity HIGH,CRITICAL

# Output JSON
trivy fs . -f json -o trivy.json

# Gerar SBOM
trivy fs . --format cyclonedx --output sbom.json
```

## Severidades

| Nível | Ação |
|-------|------|
| CRITICAL | Bloquear deploy |
| HIGH | Prioridade alta |
| MEDIUM | Planejado |
| LOW | Backlog |

## .trivyignore

```
# Ignorar CVE específica
CVE-2023-12345

# Ignorar com comentário
# This CVE is not exploitable in our context
CVE-2023-67890
```

## Formatos SBOM

| Formato | Comando |
|---------|---------|
| CycloneDX | `--format cyclonedx` |
| SPDX | `--format spdx-json` |
