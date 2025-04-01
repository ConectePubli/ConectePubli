# ===== STAGE 1: Build =====
FROM node:18-alpine AS build

# Cria e acessa a pasta de trabalho
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia todo o resto do código
COPY . .

# Gera a pasta dist
RUN npm run build

# ===== STAGE 2: Servir com Nginx =====
FROM nginx:1.23-alpine

# Copia os arquivos compilados para a pasta padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (Opcional) Se quiser customizar a config do Nginx para fallback de SPA:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
