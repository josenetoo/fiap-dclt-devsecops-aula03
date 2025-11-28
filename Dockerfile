# ============================================
# DOCKERFILE INSEGURO - PARA DEMONSTRAÇÃO
# Este Dockerfile será corrigido na Aula 04
# ============================================

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# PROBLEMAS DE SEGURANÇA (serão corrigidos na Aula 04):
# 1. Roda como root
# 2. Imagem base grande
# 3. Sem health check
# 4. node_modules copiados

EXPOSE 3000

CMD ["node", "app.js"]
