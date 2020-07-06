const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('./model/usersdetail');

module.exports = function(passport) {
    passport.use('local',
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Account is not registered' });
                }
                if (user.verified == false) {
                    return done(null, false, { message: 'Verify your account' });
                }
                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        User.updateOne({ email: email }, { $set: { 'is_active': true } }, function(err, res) {
                            if (err) throw err;
                            console.log("updated")
                        });
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid Username or Password' });
                    }
                });

            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('google', new GoogleStrategy({
            clientID: config.Google.clientID,
            clientSecret: config.Google.clientSecret,
            callbackURL: config.Google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            //console.log(profile.emails[0].value);
            User.findOne({ email: profile.emails[0].value }).then(usr => {
                if (!usr) {
                    new User({
                        firstname: profile.name.givenName,
                        lastname: profile.name.familyName,
                        email: profile.emails[0].value,
                        verified: true
                    }).save().then(newUser => {
                        return done(null, newUser);
                    });
                } else {
                    return done(null, usr)
                }
            })
        }
    ));
    passport.use('facebook', new FacebookStrategy({
            clientID: config.Facebook.clientID,
            clientSecret: config.Facebook.clientSecret,
            callbackURL: config.Facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            /*User.findOne({ email: profile.emails[0].value }).then(usr => {
                if (!usr) {
                    new User({
                        firstname: profile.name.givenName,
                        lastname: profile.name.familyName,
                        email: profile.emails[0].value
                    }).save().then(newUser => {
                        return done(null, newUser);
                    });
                } else {
                    return done(null, usr)
                }
            })*/
        }
    ))
};