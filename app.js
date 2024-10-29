const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');

// Головна сторінка
app.get('/', (req, res) => {
    res.render('index');
});

// Підключення маршрутів
app.use(bookRoutes);
app.use(adminRoutes);
app.use(authRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});