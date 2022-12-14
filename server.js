const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const knex = require('knex');
const mysqlConnection = require('./public/database/mysqlConnection');

let productList;
let mensajes;

const app = express();

const PORT = 8080;

const httpServer = new HttpServer(app);

const io = new SocketServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

class Contenedores {
  constructor(config, table) {
    this.database = knex(config);
    this.table = table;
  }

  async save(object) {
    const id = await this.database(this.table).insert(object, ['id']);
    return id;
  }

  async getById(id) {
    return this.database.select().from(this.table).where('id', parseInt(id));
  }

  async getAll() {
    return this.database.select().from(this.table);
  }

  async deleteById(id) {
    await this.database(this.table).where('id', id).del();
    return ;
  }

  async deleteAll() {
    await this.database(this.table).del();
    return ;
  }

  async update(id, object) {
    await this.database(this.table).where('id', id).update(object);
    return ;
  }
}

app.use(express.static('public'));

const product = new Contenedores(mysqlConnection,'productos');
const msg = new Contenedores(mysqlConnection,'mensajes');

io.on('connection', (socket) => {

  (async()=>{
    productList = await product.getAll();
    socket.emit('products', productList);
  })();
  

  socket.on('newProduct', (newProduct) => {
    
    
    (async()=>{
      product.save(newProduct);
      productList = await product.getAll();
      io.sockets.emit('products', productList);
    })();
    
    

  });

  (async()=>{
    mensajes = await msg.getAll();
    socket.emit('mensajes', mensajes);
  })();
  
  socket.on('newMensaje', (newMensaje) => {
    
    (async()=>{
      msg.save(newMensaje);
      mensajes = await product.getAll();
      io.sockets.emit('mensajes', mensajes);
    })();
    
  });
});

const connectedServer = httpServer.listen(PORT, () => {
  console.log('RUNNING...');
  console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
});

