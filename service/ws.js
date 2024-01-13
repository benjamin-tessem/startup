const { WebSocketServer } = require('ws');

const peerProxy = (httpServer) => {
    const wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, (socket) => {
            wss.emit('connection', socket, req);
        });
    });

    const connections = new Map();

    const scores = new Map();

    const cleanUp = (socket) => {
        // Remove the score from the scores map
        connections.delete(socket);
        scores.delete(socket);

        // rebrodcast the scores
        // Make an array of all the score objects, without the socket
        const scoreObjects = Array.from(scores).map(([, score]) => score);
        const sortedScores = scoreObjects.sort((a, b) => b.score - a.score);
        const json = JSON.stringify(sortedScores);
        for (const [clientSocket] of connections) {
            if (clientSocket !== socket) {
                clientSocket.send(json);
            }
        }
    }

    wss.on('connection', (socket, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        connections.set(socket, { ip, lastPong: Date.now() });
        console.log(`New connection from ${ip}`);

        const pingIntervalId = setInterval(() => {
            if (socket.readyState === socket.OPEN) {
                socket.ping();
            }
        }, 30000);

        socket.on('message', (message) => {
            console.log(`Received message from ${ip}: ${message}`);
            // Add the score to the scores map
            // Get the message as the JSON object
            message = JSON.parse(message);
            scores.set(socket, message);
            // Make an array of all the score objects, without the socket
            const scoreObjects = Array.from(scores).map(([, score]) => score);
            const sortedScores = scoreObjects.sort((a, b) => b.score - a.score);
            const json = JSON.stringify(sortedScores);
            for (const [clientSocket] of connections) {
                if (clientSocket !== socket) {
                    clientSocket.send(json);
                }
            }
        });

        socket.on("pong", () => {
            connections.get(socket).lastPong = Date.now();
            console.log(`Received pong from ${ip}`);
        });

        socket.on('close', () => {
            clearInterval(pingIntervalId);
            console.log(`Closed connection from ${ip}`);
            cleanUp(socket);
        });
    });

    setInterval(() => {
        const now = Date.now();
        for (const [socket, { ip, lastPong }] of connections) {
            if (now - lastPong > 5000) {
                console.log(`Closing connection from ${ip} due to inactivity`);
                socket.close();
                cleanUp(socket);

            }
        }
    }, 60000);
}

module.exports = peerProxy;