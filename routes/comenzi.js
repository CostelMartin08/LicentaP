const express = require("express");
const router = express.Router();
const db = require('./db');

router.get('/', function (req, res) {

    const param = req.app.locals.param;

    if (req.isAuthenticated()) {

        if (req.user.admin === 1) {

            db.query("SELECT * FROM comenzi", (err, result) => {
                if (err) {

                    console.log(err);
                    res.render('pages/index');

                } else {

                    res.render('pages/comenzi', { result: result, param, includeLayouts: [true] });
                }

            });

        } else {

            res.render('pages/notFound', { includeLayouts: [false] });
        }
    } else {

        res.render('pages/notFound', { includeLayouts: [false] });
    }




})

module.exports = router