# Usa imagem oficial do Node 24
FROM node:24

# Entra de trabalho
WORKDIR /app

# Copia arquivos necessários para instalar as dependencia node_modules EM TEMPO DE BUILD
COPY ./package*.json ./

COPY ./tsconfig.json ./

# Instala dependências + nodemon para "ouvir" as mudanças
RUN npm install && npm install -g vite

COPY ./vite.config.js ./

# Comando padrão ao iniciar o container
ENTRYPOINT ["vite", "build", "--watch"]
