  
const knex = require('knex');
const path = require('path');

const environment = process.env.DB_ENV || 'development';

const knexConfig = {
  development : {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'dev.sqlite3'),
    },
    useNullAsDefault: true,
  },
  production : {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  }
}



module.exports = knex(knexConfig[environment]);

