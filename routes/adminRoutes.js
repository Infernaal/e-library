const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const db = require('../database');

router.get('/admin', adminController.getAdminPage);

// Маршрут для загрузки данных из Open Library API в базу данных
router.get('/admin/load', adminController.loadBooksFromAPI);

router.post('/admin/add', adminController.addBook);

router.patch('/admin/edit/:id', adminController.editBook);

router.delete('/admin/delete/:id', adminController.deleteBook);

router.get('/admin/view/:id', adminController.viewBook);

module.exports = router;