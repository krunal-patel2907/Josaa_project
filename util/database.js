//////////// Connect MySQL DB to Node App
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'josaa_data',
    password: '*********'
});

module.exports = pool.promise();