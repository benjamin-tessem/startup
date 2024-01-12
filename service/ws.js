const { WebSockerServer } = require('ws');

const peerProxy = (httpServer) => {
    const wss = new WebSockerServer({ server: httpServer });

    httpServer.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (socket) => {
            wss.emit('connection', socket, req);
        });
    });

    const connections = new Map();

    wss.on('connection', (socket, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        connections.set(socket, ip);
        console.log(`New connection from ${ip}`);

        socket.on('message', (message) => {
            console.log(`Received message from ${ip}: ${message}`);
            for (const [clientSocket] of connections) {
                if (clientSocket !== socket) {
                    clientSocket.send(message);
                }
            }
        });

        socket.on("pong", () => {
            console.log(`Pong received from ${ip}`);
        });

        socket.on('close', () => {
            console.log(`Closed connection from ${ip}`);
            connections.delete(socket);
        });
    });

    // Ping clients, if they don't respond, close the connection
    setInterval(() => {
        for (const [socket, ip] of connections) {
            console.log(`Ping sent to ${ip}`);
            socket.ping();

            setTimeout(() => {
                if (socket.readyState === socket.OPEN) {
                    console.log(`Closing connection to ${ip} due to timeout`);
                    socket.terminate();
                }
            }, 5000);
        }
    }, 30000);
}

module.exports = peerProxy;