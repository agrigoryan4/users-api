const express = require('express');
const morgan = require('morgan');

class User {
    constructor(id, username, password) {
        if(!id || !username || !password) throw new Error('Invalid arguments');
        this.id = id;
        this.username = username;
        this.password = password;
    }
}

class Users {
    constructor() {
        this.users = [];
    }
    doesUsernameExist(username) {
        if(!username) throw new Error('No username provided as an argument');
        const doesExist = this.users.some(user => user.username === username);
        return doesExist;
    }
    addUser(username, password) {
        if(!username || !password) throw new Error('Invalid arguments');
        if(this.doesUsernameExist(username)) throw new Error('Username already exists');
        const newUser = new User((this.users.length + 1).toString(), username, password);
        this.users.push(newUser);
    }
    getAllUsers() {
        return this.users;
    }
    getUser(id) {
        if(!id) throw new Error('No id provided');
        const user = this.users.find(user => user.id === id);
        return user;
    }
    deleteUser(id) {
        if(!id) throw new Error('No id provided');
        let isDeleted = false;
        this.users = this.users.filter(user => {
            console.log(`userid: ${user.id}, id: ${id}`);
            if(user.id === id) {
                isDeleted = true;
                return false;
            }
            return true;
        });
        if(!isDeleted) throw new Error('No user found with the given id');
        return;
    }
    editUser(id, username, password) {
        if(!id) throw new Error('No id provided as a first argument');
        if(this.doesUsernameExist(username)) throw new Error('Username already exists');
        const user = this.users.find(user => user.id === id);
        if(!user) throw new Error('No user found with the given id');
        user.username = username ? username : user.username;
        user.password = password ? password : user.password;
        return user;
    }
}

const users = new Users();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes

app.post('/create', (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.sendStatus(400);
    }
    try {
        users.addUser(username, password);
    } catch (error) {
        return res.sendStatus(400).json({ error: error });
    }
    return res.sendStatus(200);
});

app.put('/edit', (req, res) => {
    const { id, username, password } = req.body;
    if(!id) return res.sendStatus(400);
    try {
        const userEdited = users.editUser(id, username, password);
        return res.status(200).json({ userEdited: userEdited });
    } catch (error) {
        res.sendStatus(404);
    }
});

app.get('/getone', (req, res) => {
    const { id } = req.body;
    if(!id) return res.sendStatus(400);
    const user = users.getUser(id);
    if(!user) return res.sendStatus(404);
    return res.status(200).json({ user: user });
});

app.get('/getall', (req, res) => {
    const allUsers = users.getAllUsers();
    res.status(200).json({ users: allUsers });
});

app.delete('/user', (req, res) => {
    const { id } = req.body;
    if(!id) return res.sendStatus(400);
    try {
        users.deleteUser(id);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
    }
});

app.listen(3000, 'localhost', () => {
    console.log('Server listening');
});
