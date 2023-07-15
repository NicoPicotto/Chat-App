const { Server } = require('socket.io');

const init = (httpServer) => {

    const io = new Server(httpServer);
    
    io.on('connection', (socket) => {
        console.log(`${socket.id}: Nuevo cliente conectado`);
    });

    return io

}


module.exports = init