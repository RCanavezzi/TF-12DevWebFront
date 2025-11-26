# Usa imagem oficial do Node 24
FROM node:24

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos essenciais para instalar dependências
COPY package*.json ./
COPY _command.js ./
COPY app/Commands/ ./app/Commands/      

# Instala dependências (e opcionalmente o minimist ou chalk se usados)
RUN npm install

# Dá permissão de execução para o script CLI (caso necessário)
RUN chmod +x ./_command.js

# Define o entrypoint como o script de comandos (sem extensão)
ENTRYPOINT ["node", "_command.js"]
