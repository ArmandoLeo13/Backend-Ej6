const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const fs = require('fs');

const app = express();

const PORT = 8080;

const httpServer = new HttpServer(app);

const io = new SocketServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productList = [];
const mensajes = [];

app.use(express.static('public'));

const getAll = async(archivo) => {
  let contenido 
  let nuevaData 
  try{
      contenido = await fs.promises.readFile(archivo,'utf-8');
      nuevaData = JSON.parse(contenido);
  }
  catch (err){
      console.log(err);
  }
  return nuevaData
}

const save = async(archivo,object) => {
  try{
      let data = await getAll(archivo);          
      
      data.push(object);

      let dataFinal = JSON.stringify(data);

      fs.promises.writeFile(archivo,dataFinal);
      return object.id
  }
  catch (err){
      console.log(err);
  }
}
io.on('connection', (socket) => {

  socket.emit('products', productList);

  socket.on('newProduct', (newProduct) => {
    
    save('productos.txt',newProduct);
    productList.push(newProduct);
    io.sockets.emit('products', productList);

  });

  socket.emit('mensajes', mensajes);

  socket.on('newMensaje', (newMensaje) => {
    
    save('mensajes.txt',newMensaje);
    mensajes.push(newMensaje);
    io.sockets.emit('mensajes', mensajes);

  });
});

const connectedServer = httpServer.listen(PORT, () => {
  console.log('RUNNING...');
  console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
});







