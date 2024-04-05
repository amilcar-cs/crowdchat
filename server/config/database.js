const mysql = require('mysql');
// Usar Variables de Entorno
const dotenv = require('dotenv');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Configuración de la conexión a la base de datos
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
dbConnection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

// Promisify the dbConnection.query method
dbConnection.queryAsync = function (sql, values) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = dbConnection;
