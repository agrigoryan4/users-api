const { Model } = require('sequelize');
const joiUserValidation = require('../utils/validation/userValidation');

class User extends Model {}

module.exports = (sequelize, DataTypes) => {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      validate: {
        isId(value) {
          const { error, result } = joiUserValidation.validate({
            id: value,
          });
          if (error) {
            throw error;
          }
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUsername(value) {
          const { error, result } = joiUserValidation.validate({
            username: value,
          });
          if (error) {
            throw error;
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
  });
  return User;
};
