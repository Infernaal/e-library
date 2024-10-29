module.exports = {
    table: 'books',
    columns: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        title: 'TEXT NOT NULL',
        author: 'TEXT NOT NULL',
        description: 'TEXT',
        published_year: 'INTEGER',
        image: 'TEXT',
        download_url : 'TEXT'
    }
};