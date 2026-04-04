import "dotenv/config";
import { createServer } from "node:http";
import { createExpressApplication } from "./app";
import { env } from "./env";

const PORT: number = env.PORT ? +env.PORT : 5000;

const app = createExpressApplication();
const server = createServer(app);

let isShuttingDown = false;

async function start() {
    try {
        // await db.connect(); // agar needed ho

        server.listen(PORT, () => {
            console.log(
                `[${new Date().toISOString()}] Server running on PORT:${PORT} in ${env.NODE_ENV} mode`,
            );
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

start();

// Graceful Shutdown
async function shutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`Received ${signal}. Shutting down...`);

    const forceTimer = setTimeout(() => {
        console.error("Force shutdown...");
        process.exit(1);
    }, 10000);

    server.close(async () => {
        console.log("HTTP Server closed");

        try {
            // await db.disconnect(); // agar needed ho
            console.log("DB disconnected");
        } catch (err) {
            console.error("Error closing DB:", err);
        }

        clearTimeout(forceTimer);
        process.exit(0);
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    shutdown("unhandledRejection");
});

server.on("error", (err) => {
    console.error("Server error:", err);
});
