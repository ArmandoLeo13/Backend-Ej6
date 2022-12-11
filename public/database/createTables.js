const knex = require('knex');
const mysqlConnection = require('./mysqlConnection');


const createProductTable = async () => {
  try {
    const database = knex(mysqlConnection);
    await database.schema.dropTableIfExists('productos');
  
    await database.schema.createTable('productos', (table) => {
      table.increments('id').primary()
      table.string('title', 15).notNullable()
      table.float('price', 15).notNullable()
      table.string('url', 255).notNullable()
    });
  
    console.log('TABLE productos created');
  } catch (error) {
    console.log('TABLE productos error: ', error)
  }
};

const createMessageTable = async () => {
  try {
    const database = knex(mysqlConnection);
    await database.schema.dropTableIfExists('mensajes');
  
    await database.schema.createTable('mensajes', (table) => {
      table.increments('id').primary()
      table.string('email', 100).notNullable()
      table.string('mensaje', 255).notNullable()
      table.string('fhora', 255).notNullable()
    });
  
    console.log('TABLE mensajes created');
  } catch (error) {
    console.log('TABLE mensajes error: ', error)
  }
};

const createTables = async () => {
  await createProductTable();
  await createMessageTable();
}

createTables();