const ModelMock = require('../../utils/mocks/ModelMock');

const Sequelize = null;
const sequelize = {
  models: {},
};

sequelize.models.User = new ModelMock();

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;
