import { createServer } from "node:http";
import { createExpressApplication } from "./app";

async function main() {
    try {
        const server = createServer(createExpressApplication());
        const PORT = process.env.PORT ? +process.env.PORT : 5000;
        server.listen(PORT, () =>
            console.log(`Http server is running on PORT:${PORT}`),
        );
    } catch (error) {
        console.log(`Error starting http server`);
        throw error;
    }
}

main();
