const express = require('express');
const router = express.Router();
const { getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
loginUser } = require('../controllers/user.controller');

router.get('/', getUsers);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
