const express = require('express');
const router = express.Router();

const NewRepository = require('../repositories/NewRepository');
const NewService = require('../services/NewService');
const NewController = require('../controllers/newController');

const { protect, admin } = require('../middleware/authMiddleware');

const newRepository = new NewRepository();
const newService = new NewService(newRepository);
const newController = new NewController(newService);

//routes:
router.get('/', (req, res) => newController.getAll(req, res));
router.get('/:id', (req, res) => newController.getById(req, res));

//solo admin
router.post('/', protect, admin, (req, res) => newController.create(req, res));
router.put('/:id', protect, admin, (req, res) => newController.update(req, res));
router.delete('/:id', protect, admin, (req, res) => newController.delete(req, res));

module.exports = router;
