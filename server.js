const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const knex = require("knex");
const mysqlConnection = require('./public/database/mysqlConnection');
const sqliteConnection = require('./public/database/sqliteConnection');

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

  getById(id) {
    return this.database.select().from(this.table).where('id', parseInt(id));
  }

  getAll() {
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
const msg = new Contenedores(sqliteConnection,'mensajes');

io.on('connection', (socket) => {

  socket.emit('products', product.getAll());

  socket.on('newProduct', (newProduct) => {
    
    product.save(newProduct);
    let productList = product.getAll();
    io.sockets.emit('products', productList);

  });

  socket.emit('mensajes', msg.getAll());

  socket.on('newMensaje', (newMensaje) => {
    
    msg.save(newMensaje);
    let mensajes = msg.getAll();
    io.sockets.emit('mensajes', mensajes);

  });
});

const connectedServer = httpServer.listen(PORT, () => {
  console.log('RUNNING...');
  console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
});







