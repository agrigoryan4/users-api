const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('user-api', 'hp', '7777', {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432
});

const connect = async () => {
    await sequelize.authenticate();
    await sequelize.sync();
};

module.exports.sequelize = sequelize;
module.exports.connect = connect;
