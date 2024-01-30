const express = require("express");
const router = express.Router();
const db = require('./db');


//Comenzi utilizator obisnuit
router.get('/', function (req, res) {

    const username = req.app.locals.email;

 
            db.query("SELECT * FROM comenzi WHERE email = ?", [username], (err, result) => {
                if (err) {
                    console.log(err);
                    res.render('pages/notFound', { includeLayouts: [false] });
                } else {
                    console.log(result)
                    res.render('pages/comenziUtilizator', { result: result, includeLayouts: [true] });
                }
            });

    

})

module.exports = router