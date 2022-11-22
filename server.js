const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const app = express();

const PORT = 8080;

const httpServer = new HttpServer(app);

const io = new SocketServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productList = [];
const mensajes = [];

app.use(express.static('public'));

io.on('connection', (socket) => {

  socket.emit('products', productList);

  socket.on('newProduct', (newProduct) => {
    
    productList.push(newProduct);
    io.sockets.emit('products', productList);

  });

  socket.emit('mensajes', mensajes);

  socket.on('newMensaje', (newMensaje) => {
    
    mensajes.push(newMensaje);
    io.sockets.emit('mensajes', mensajes);

  });
});

const connectedServer = httpServer.listen(PORT, () => {
  console.log('RUNNING...');
  console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
});







