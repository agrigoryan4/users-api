const userModel = require('../db/user.model');

class UsersController {
    static addUser(req, res) {
        const { username, password } = req.body; 
        if(!username || !password) return res.status(400);
        if(userModel.find({ username }).length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        try {
            const newUser = userModel.build({ 
                id: (Math.ceil(Math.random() * Math.pow(10, 6))).toString(), 
                username, 
                password 
            });
            newUser.save();
            return res.sendStatus(200);
        } catch (error) {
            return res.sendStatus(500);
        }
    }
    static getUser(req, res) {
        const { id } = req.params;
        if(!id) {
            const users = userModel.find({});
            return res.status(200).json({ users: users });
        }
        try {
            const user = userModel.find({ id: id });
            if(user.length === 0) return res.sendStatus(404);
            return res.status(200).json({ user: user });
        } catch (error) {
            return res.status(404).json({ error: error });
        }
    }
    static deleteUser(req, res) {
        const { id } = req.body;
        try {
            userModel.findByIdAndDelete(id);
            return res.status(202).json({ message: 'User successfully deleted' });
        } catch (error) {
            return res.status(404).json({ error: error });
        }
    }
    static editUser(req, res) {
        const { id, username, password } = req.body; 
        if(!id) return res.status(400);
        const user = userModel.find({ id });
        if(!user) return res.status(404).json({ error: 'Invalid id' });
        if(userModel.find({ username }).length !== 0) {
            return res.status(409).json({ error: 'Already existing username'});
        }
        try {
            const updateObject = {};
            if(username) updateObject.username = username;
            if(password) updateObject.password = password;
            userModel.findByIdAndUpdate(id, updateObject);
            return res.status(200).json({ message: 'User successfully modified' });
        } catch (error) {
            return res.status(500);
        }
    }
}

module.exports = UsersController;
