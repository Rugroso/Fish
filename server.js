const { instrument } = require("@socket.io/admin-ui");
const { Socket } = require("socket.io");

const io = require ("socket.io" ) (3000, {
  cors: {
  origin: ["http://localhost:5502","http://10.37.129.2:5502","https://admin.socket.io"],
  credentials: true
  }, })
  instrument(io, {
    auth: false,
    credentials: true
  });
  
  
io.on("connection", socket => {
console.log (socket.id)
})

let players = [];

io.on('connection', (socket) => {
    players.push(socket);
    console.log('New connection:', socket.id);
    socket.join(512);

    socket.on('joinRoom', (room, oldRoom, id) => {
        socket.leave(oldRoom)
        socket.join(room);
        const toSend = {
            id : id,
            x: -300,
            y: -300
        };
        io.to(oldRoom).emit('newPosition', toSend)
    });

    socket.on('playerDisconnected', (id, room) => {
        const toSend = {
            id:id,
            x:-300,
            y:300,
        };
        console.log("Si entro aqui")
        io.to(room).emit('newPosition', toSend)
    });

    socket.on('update', (data) => {
        try {
            const toSend = {
                id: data.id,
                x: data.x,
                y: data.y,
                dx: data.dx,
                dy: data.dy,
                roomId: data.roomId,
                name: data.name,
                message: data.message,
                angleDegreesmv: data.angleDegreesmv,
                timeMessage: data.timeMessage,
                socketId: socket.id
            };
            io.to(data.roomId).emit('update', toSend);
        } catch (error) {
            console.log('Error handling message:', error);
        }
    });

    socket.on('disconnect', () => {
        players = players.filter(p => p.id !== socket.id);
        io.emit("socketDisconnected", socket.id);
        console.log (`Disconnected: ${socket.id}`)
    });
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});
