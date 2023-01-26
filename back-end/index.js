import { CONFIG } from './config/Config';
import {app} from './src/app';
import http from 'http';

const server = http.createServer(app);

server.listen(CONFIG.SERVER.PORT, CONFIG.SERVER.HOST, () => {
    console.log(`Listening on http://${CONFIG.SERVER.HOST}:${CONFIG.SERVER.PORT}`)
}).on("error", (err) => {
    console.log(err)
    process.exit(0)
});