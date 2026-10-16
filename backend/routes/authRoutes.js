const express = require('express');
const router = express.Router();

const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');
const AuthController = require('../controllers/authController');
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// routes endpoint auth:
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;
