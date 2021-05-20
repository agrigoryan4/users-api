const { Sequelize } = require('sequelize');

const {
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT
} = process.env;


const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    dialect: 'postgres',
    host: DB_HOST,
    port: DB_PORT
});

const connect = async () => {
    await sequelize.authenticate();
    await sequelize.sync();
};

module.exports.sequelize = sequelize;
module.exports.connect = connect;
