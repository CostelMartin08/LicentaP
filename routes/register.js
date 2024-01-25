const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
var mysql = require('mysql');



const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "vinylshop"
});

router.get('/', (req, res) => {

    res.render('pages/register', { includeLayouts: [false] });


});

router.post('/', async (req, res) => {

    pool.getConnection(async (err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const username = req.body.username;
        const phone = req.body.number;
        const password = await bcrypt.hash(req.body.password, 10);

        const query = "INSERT INTO users(firstName, lastName, username, phone, password) VALUES ?";
        const values = [
            [firstName, lastName, username, phone,  password]
        ];

        connection.query(query, [values], async (queryErr, result) => {
            connection.release();

            if (queryErr) {
                console.error('Error executing query:', queryErr.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            try {
                const affectedRows = result.affectedRows;

                if (affectedRows > 0) {
                    res.redirect('/login');
                } else {
                    res.status(500).send('Eroare la crearea contului!');
                }
            } catch (error) {
                console.error('Eroare la procesarea rezultatului interogării:', error.message);
                res.status(500).send('Internal Server Error');
            }
        });
    });


});


module.exports = router    