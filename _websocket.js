import { WebSocketServer } from "ws";
import chalk from "chalk";
import { getConnection } from "./config/rabbit.js"; // ajusta o caminho se precisar

const SOCKET_PORT = Number(process.env.SOCKET_PORT ?? 8081);

// pega --exchange=room da CLI, se existir
const exchangeArg = process.argv.find((arg) => arg.startsWith("--exchange="));
const EXCHANGE_NAME = exchangeArg ? exchangeArg.split("=")[1] : "websocket";

const websocket = new WebSocketServer({ port: SOCKET_PORT });

// Canal global pro Rabbit, pra consumir E publicar
let rabbitChannel = null;

function broadcastJson(payload) {
    const message = JSON.stringify(payload);
    websocket.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}

// --- Bridge RabbitMQ <-> WebSocket ---
async function setupRabbitWebsocketBridge() {
    try {
        const channel = await getConnection();
        rabbitChannel = channel;

        // Exchange fanout compartilhada
        await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });

        // Fila EXCLUSIVA pra esse processo WS
        const q = await channel.assertQueue("", {
            exclusive: true,
            durable: false,
            autoDelete: true,
        });

        await channel.bindQueue(q.queue, EXCHANGE_NAME, "");

        console.log(
            chalk.green(
                `[Rabbit] WebSocket ligado no exchange "${EXCHANGE_NAME}" (fanout) com fila exclusiva "${q.queue}"`
            )
        );

        // Consumindo TUDO que vem do Rabbit e repassando pros clientes
        channel.consume(
            q.queue,
            (msg) => {
                if (!msg) return;

                let data;
                try {
                    data = JSON.parse(msg.content.toString());
                } catch {
                    console.error("[Rabbit] Mensagem inválida:", msg.content.toString());
                    channel.ack(msg);
                    return;
                }

                // Aqui definimos como isso vai aparecer pros clients
                // data vem do próprio cliente (join/message) OU do evento de disconnect
                if (data.type === "join" && data.name) {
                    broadcastJson({
                        type: "system",
                        text: `${data.name} entrou no chat`,
                    });
                } else if (data.type === "leave" && data.name) {
                    broadcastJson({
                        type: "system",
                        text: `${data.name} saiu do chat`,
                    });
                } else if (data.type === "message" && data.name && data.text) {
                    broadcastJson({
                        type: "message",
                        name: data.name,
                        text: data.text,
                    });
                } else {
                    console.log("[Rabbit] Tipo desconhecido vindo da fila:", data);
                }

                channel.ack(msg);
            },
            { noAck: false }
        );
    } catch (err) {
        console.error(chalk.red("[Rabbit] Erro no bridge Rabbit -> WS:"), err);
    }
}

setupRabbitWebsocketBridge();

// helper pra publicar no exchange
function publishToRabbit(payload) {
    if (!rabbitChannel) {
        console.warn("[Rabbit] Canal ainda não pronto, ignorando mensagem:", payload);
        return;
    }

    rabbitChannel.publish(
        EXCHANGE_NAME,
        "", // routingKey ignorada em fanout
        Buffer.from(JSON.stringify(payload))
    );
}

// --- WebSocket ---

websocket.on("connection", (ws) => {
    console.log(chalk.cyan("Cliente conectado.."));

    ws.on("message", (raw) => {
        const text = raw.toString();
        console.log(chalk.yellow("Do client:"), text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.log("Mensagem não é JSON válido, ignorando.");
            return;
        }

        // 👉 AGORA: nada de broadcast direto.
        // Tudo que vier do client vai pra fila.

        if (data.type === "join" && data.name) {
            ws.userName = data.name;

            // manda evento de "join" pra fila
            publishToRabbit({
                type: "join",
                name: data.name,
            });

            return;
        }

        if (data.type === "message" && data.name && data.text) {
            // mensagem normal: também vai pra fila
            publishToRabbit({
                type: "message",
                name: data.name,
                text: data.text,
            });

            return;
        }

        console.log("Tipo de mensagem desconhecido vindo do client:", data);
    });

    ws.on("close", () => {
        console.log(chalk.gray("Cliente desconectado."));
        if (ws.userName) {
            publishToRabbit({
                type: "leave",
                name: ws.userName,
            });
        }
    });
});

console.log(
    chalk.greenBright(
        `WebSocket rodando na porta ${SOCKET_PORT} usando exchange "${EXCHANGE_NAME}"...`
    )
);
