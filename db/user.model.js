const Model = require('./model');
const db = require('./db');

class User extends Model {
    constructor() {
        const schema = {
            id: null,
            username: null,
            password: null
        };
        super(db.users, schema);
    }
}

module.exports = new User();