const express = require('express');
const router = express.Router();
const { getUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser, 
loginUser,
getProfile } = require('../controllers/user.controller');

router.get('/', getUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', getProfile);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
