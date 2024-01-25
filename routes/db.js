const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "vinylshop"
});

connection.connect((err) => {
    if (err) {
      console.error('Eroare la conectarea la baza de date:', err);
      return;
    }
    console.log('Conectat la baza de date');

  });
  
  module.exports = connection;
