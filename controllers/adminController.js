const axios = require('axios');
const db = require('../database');

exports.getAdminPage = (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            res.status(500).send('Error retrieving book data.');
        } else {
            res.render('admin', { books: rows });
        }
    });
};

exports.loadBooksFromAPI = async (req, res) => {
    try {
        const response = await axios.get('https://openlibrary.org/search.json?q=programming&sort=editions');
        const booksData = response.data.docs.slice(0, 20);

        db.run('DELETE FROM books', async (err) => {
            if (err) {
                console.error('Error clearing books table:', err.message);
                res.status(500).send('Error while trying to clear the library.');
                return;
            }

            for (const book of booksData) {
                const title = book.title;
                const author = book.author_name && book.author_name.length > 0 
                        ? book.author_name[0]
                        : 'Unknown';
                const image = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '';
                const download_url = book.cover_edition_key ? `https://archive.org/download/${book.cover_edition_key}/${book.cover_edition_key}.pdf` : '';

                let description = 'No description available';

                if (book.key) {
                    try {
                        const bookDetailsResponse = await axios.get(`https://openlibrary.org${book.key}.json`);
                        const bookDetails = bookDetailsResponse.data;
                        if (bookDetails.description) {
                            description = typeof bookDetails.description === 'string' 
                                ? bookDetails.description 
                                : bookDetails.description.value;

                            description = description
                                .replace(/\[.*?\]\(.*?\)/g, '')
                                .replace(/https?:\/\/[^\s]+/g, '')
                                .replace(/<\/?[^>]+(>|$)/g, '')
                                .replace(/\[\d+\]/g, '')
                                .replace(/\[.*?\]/g, '');
                        }
                    } catch (error) {
                        console.error(`Error fetching book details for ${title}:`, error.message);
                    }
                }

                const published_year = book.first_publish_year 
                    ? `Published in ${book.first_publish_year}` 
                    : 'No published year available';

                db.run(
                    `INSERT INTO books (title, author, description, published_year, image, download_url) VALUES (?, ?, ?, ?, ?, ?)`,
                    [title, author, description, published_year, image, download_url],
                    (err) => {
                        if (err) {
                            console.error('Error inserting book into database:', err.message);
                        }
                    }
                );
            }

            res.json({
                message: 'Books successfully loaded into the database.'
            });
        });
    } catch (error) {
        console.error('Error retrieving data from Open Library API:', error);
        res.status(500).send('Error loading books.');
    }
};

exports.addBook = async (req, res) => {
    const { title, author, description, published_year, image, download_url } = req.body;

    try {
        await db.run(
            'INSERT INTO books (title, author, description, published_year, image, download_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, author, description, published_year, image, download_url]
        );
        res.json({
            message: 'The book has been successfully added to the site!'
        });
    } catch (error) {
        console.error('Error adding the book:', error);
        res.status(500).json({ message: 'Error adding the book', error });
    }
};

exports.editBook = async (req, res) => {
    const { id } = req.params; 
    const { title, author, description, published_year, image, download_url } = req.body;

    try {
        let fields = [];
        let values = [];

        if (title) {
            fields.push('title = ?');
            values.push(title);
        }
        if (author) {
            fields.push('author = ?');
            values.push(author);
        }
        if (description) {
            fields.push('description = ?');
            values.push(description);
        }
        if (published_year) {
            fields.push('published_year = ?');
            values.push(published_year);
        }
        if (image) {
            fields.push('image = ?');
            values.push(image);
        }
        if (download_url) {
            fields.push('download_url = ?');
            values.push(download_url);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                message: 'No fields provided for update.'
            });
        }

        values.push(id);
        const query = `UPDATE books SET ${fields.join(', ')} WHERE id = ?`;
        await db.run(query, values);

        res.json({
            message: 'The book has been successfully updated!'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the book', error });
    }
};

exports.deleteBook = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ message: 'Book ID is required.' });
    }

    try {
        const book = await db.get('SELECT * FROM books WHERE id = ?', [id]);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        await db.run('DELETE FROM books WHERE id = ?', [id]);
        res.json({
            message: 'The book has been successfully deleted!'
        });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting the book', error });
    }
};

exports.viewBook = (req, res) => {
    const bookId = req.params.id;

    db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving book data', error: err });
        }
        if (!row) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(row);
    });
};