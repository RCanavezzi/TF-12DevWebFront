import { getConnection } from '../../config/rabbit.js';
import registerJobs from './registerJobs.js';

// vou assumir que getTime está definido em algum util seu
// se não, você já tinha esse helper em outro lugar no código original

/**
 * Lógica de criação do entrypoint worker
 * Registro e event loop
 * Podemos escolher o diretório de registro dos Jobs
 */
export default async function createWorker(dir) {
    /** Registro dos jobs */
    const jobMap = await registerJobs(dir);

    /**
     * listen(queue, type)
     *
     * queue: nome da fila (string)
     * type:
     *   - undefined  => worker normal (consome direto da fila)
     *   - 'websocket' => worker ligado num exchange fanout
     */
    async function listen(queue = 'default', exchange = undefined) {

        const channel = await getConnection();

        // sempre garante a fila
        await channel.assertQueue(queue, { durable: true });

        // se for worker "websocket", ligar num exchange fanout
        if (exchange !== null) {

            await channel.assertExchange(exchange, 'fanout', { durable: true });
            await channel.bindQueue(queue, exchange, '');

            console.log(`[WORKER] Ligado ao exchange "${exchange}" (fanout) com queue "${queue}"`);
        }

        // concorrência fixa em 1 (como no seu comentário)
        await channel.prefetch(1);

        channel.consume(queue, async (msg) => {
            if (!msg) {
                return;
            }

            const start = Date.now();

            try {
                const { job, payload } = JSON.parse(msg.content.toString());

                const jobHandle = jobMap[job];

                if (!jobHandle) {
                    throw new Error(`Job "${job}" não registrado`);
                }

                console.log(`[${getTime()}] Executando ${job} da fila "${queue}"`);

                await jobHandle(payload);

                const duration = ((Date.now() - start) / 1000).toFixed(3);

                console.log(
                    `[${getTime()}] Executado ${job} da fila "${queue}" (Finalizado em ${duration}s)`
                );

                channel.ack(msg);
            } catch (err) {
                console.error(`[${getTime()}] Erro ao processar job:`, err);

                // requeue = false (joga fora ou vai pra DLX, dependendo da config)
                channel.nack(msg, false, false);
            }
        });

        console.log(`[WORKER] Fila: "${queue}"`);
        console.log(`[WORKER] Tipo: ${type || 'normal'}`);
    }

    return { listen };
}
