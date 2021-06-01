require('dotenv').config();

const {
  SERVER_HOST,
  SERVER_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
} = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: 'postgres',
    serverHost: SERVER_HOST,
    serverPort: SERVER_PORT,
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    serverHost: SERVER_HOST,
    serverPort: SERVER_PORT,
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
    serverHost: SERVER_HOST,
    serverPort: SERVER_PORT,
  },
};
