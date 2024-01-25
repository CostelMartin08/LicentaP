const mysql = require('mysql');
const bcrypt = require("bcrypt");
const db = require('../routes/db');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            db.query('SELECT * FROM users WHERE username = ?', [username], async (err, rows) => {
                if (err) {
                    return done(err);
                }

                if (!rows || rows.length === 0) {
                    return done(null, false);
                }

                const user = rows[0];
                const hashedPassword = user.password;

                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                if (passwordMatch) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        } catch (error) {
            return done(error);
        }
    })
);


    passport.serializeUser((user, cb) => {
        
        cb(null, user.id);
    });

    passport.deserializeUser(async (id, cb) => {
        try {

            db.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
                if (err) {
                    return cb(err, null);
                }
                const user = rows[0];
                const userInformation = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.username,
                    phone:user.phone,          
                    username: user.id,
                    admin: user.admin
                };
                cb(null, userInformation);
            });
        } catch (error) {
            cb(error, null);
        }
    });
};
