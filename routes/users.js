const express = require('express');
const userCtrl = require('../controllers/users');

const router = express.Router();

router.get('/getuser/:id?', userCtrl.getUser);
router.post('/create', userCtrl.addUser);
router.patch('/edit', userCtrl.editUser);
router.delete('/deleteuser', userCtrl.deleteUser);

module.exports = router;