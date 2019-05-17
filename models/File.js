const db = require('../db');
module.exports = db.defineModel('files', {
    file: db.BLOB('long'),
    localPath:db.STRING,
    name:db.STRING,
    size:db.STRING,
});