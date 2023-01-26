import {app} from './src/app';
import http from 'http';

const PORT = 3000;
const HOST = '127.0.0.1';

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`)
}).on("error", (err) => {
    console.log(err)
    process.exit(0)
});