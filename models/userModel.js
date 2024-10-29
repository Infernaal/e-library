const db = require('../database');
const bcrypt = require('bcrypt');

class User {
    static findByUsername(username, callback) {
        if (!username) {
            return callback(new Error('Username is required'));
        }

        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return callback(new Error('Database error: ' + err.message));
            }
            if (!row) {
                return callback(new Error('User not found'));
            }
            callback(null, row);
        });
    }

    static createUser(email, username, passwordHash, callback) {
        if (!email || !username || !passwordHash) {
            return callback(new Error('All fields are required'));
        }
    
        db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, passwordHash], function(err) {
            if (err) {
                if (err.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username')) {
                    return callback('Username is already taken');
                } else if(err.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email')) {
                    return callback('Email is already taken');
                }
                return callback(new Error('Database error: ' + err.message));
            }
            callback(null, { id: this.lastID });
        });
    }

    static verifyPassword(password, hash, callback) {
        if (!password || !hash) {
            return callback(new Error('Password and hash are required'));
        }

        bcrypt.compare(password, hash, (err, match) => {
            if (err) {
                return callback(new Error('Error comparing passwords: ' + err.message));
            }
            callback(null, match);
        });
    }
}

module.exports = User;