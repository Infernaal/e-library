const sqlite3 = require('sqlite3').verbose();

// Підключення до бази даних (якщо файл library.db не існує, він буде створений)
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");

        // Створення таблиці для книг, якщо її немає
        db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            description TEXT,
            published_year INTEGER,
            image TEXT,
            download_url TEXT
        )`, (err) => {
            if (err) {
                console.error("Error creating 'books' table:", err.message);
            } else {
                console.log("'books' table created or already exists.");
            }
        });

        // Створення таблиці для користувачів, якщо її немає
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating 'users' table:", err.message);
            } else {
                console.log("'users' table created or already exists.");
            }
        });
    }
});

module.exports = db;