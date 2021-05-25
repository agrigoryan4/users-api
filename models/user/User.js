const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database');
const joiUserValidation = require('../../utils/validation/userValidation');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
            isId(value) {
                const { error, result } = joiUserValidation.validate({
                    id: value
                });
                if(error) {
                    throw error;
                }
            }
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUsername(value) {
                const { error, result } = joiUserValidation.validate({
                    username: value
                });
                if(error) {
                    throw error;
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize
});

module.exports = User;
