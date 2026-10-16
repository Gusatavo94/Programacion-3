const express = require('express');
const router = express.Router();

const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');
const UserController = require('../controllers/userController');

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/', (req, res) => userController.getAll(req, res));
router.get('/:id', (req, res) => userController.getById(req, res));
router.post('/', (req, res) => userController.create(req, res));
router.put('/:id', (req, res) => userController.update(req, res));
router.delete('/:id', (req, res) => userController.delete(req, res));

module.exports = router;
