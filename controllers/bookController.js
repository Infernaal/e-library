const axios = require('axios');
const db = require('../database');

// Функция для получения книг из базы данных и передачи их на страницу
exports.getBooksFromDB = (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error('Error retrieving books from the database:', err.message);
            res.status(500).send('Error fetching data');
        } else {
            res.render('books', { books: rows });
        }
    });
};