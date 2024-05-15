const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });
let players = [];
server.on('connection', function(ws) {
    players.push(ws);

    ws.on('message', function(message) {
        try {
            console.log(`Received: ${message}`);
            const data = JSON.parse(message);
            const toSend = JSON.stringify({ id: data.id, x: data.x, y: data.y, dx:data.dx, dy:data.dy });
            players.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(toSend);
                }
            });
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    ws.on('close', () => {
        players = players.filter(p => p !== ws);
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});
