// Update with your config settings.
const path = require('path');

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', './dev.sqlite3'),
    },
    migrations:{
      directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds:{
      directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
    useNullAsDefault:true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  }

};
