const express = require('express');
const router = express.Router();
const booksController = require('../controllers/bookController');

// Маршрут для отображения книг из базы данных
router.get('/books', booksController.getBooksFromDB);

module.exports = router;