const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../auth');
const users = require("../model/usersdetail");
const chatroom = require("../model/chatroom");
const Swal = require('sweetalert2');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

let storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true);
    } else {
        return cb(null, false);
    }
}

router.post('/profilepic', upload.single('user-image'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        req.flash('img_err', 'images with ext jpeg,jpg,png,gif only!!');
        res.redirect('/account');
    }

    let url = file.path.replace('public', '');

    users.updateOne({ _id: req.user._id }, { $set: { imgURL: url } }, function(err, result) {
        if (err) console.log(err);
        console.log("updated image");
        res.redirect('/account');
    });
});

router.post('/Removepic', (req, res) => {
    users.updateOne({ _id: req.user._id }, { $set: { imgURL: null } }, function(err, result) {
        if (err) console.log(err);
        res.redirect('/account');
    });
})

router.get("/chat", ensureAuthenticated, (req, res) => {
    req.app.set('user', req.user._id);
    users.findOne({ phone: req.user.phone })
        .populate('contacts')
        .exec(function(err, user) {
            var ucontacts = [],
                chats = [];
            if (!user) {
                //req.flash('profilemessage','No such user exists.');
            } else {
                user.contacts.forEach(function(i) {
                    ucontacts.push(i);
                });
                chatroom.find({ members: { $in: [req.user._id] } })
                    //.sort({created_at: "dsc"})
                    .exec(function(ch_err, chat) {
                        //var chats = [];
                        //console.log(chat);
                        res.render('messagingclone', { user: req.user, ucontacts: ucontacts, chats: chat, moment: moment });
                    });
            }
        });
});
router.get("/account", ensureAuthenticated, (req, res) => {
    res.render('account', { user: req.user })
});
router.get("/", forwardAuthenticated, (req, res) => {
    res.render('authenticate');
});
router.get("/addcontact", (req, res) => {
    res.render('addcontact', { user: '' });
});
router.get('/searchcontact', (req, res) => {
    let searchQuery = { phone: req.query.search };

    users.findOne(searchQuery)
        .then(user => {
            if (user == null) {
                req.flash('contact_err', 'contact not found!!');
                //console.log('nahi hua');
                res.redirect('/chat');
            } else {
                conts = req.user.contacts;
                if (req.user.phone == user.phone) {
                    req.flash('contact_err', 'you are using the same account!!');
                } else if (!conts.includes(user._id)) {
                    users.updateOne({ phone: req.user.phone }, { $addToSet: { contacts: user._id } }, function(err, res) {
                        if (err) console.log(err);
                        console.log("updated contact");
                    });


                    chatroom.findOne({ $or: [{ members: [req.user._id, user._id] }, { members: [user._id, req.user._id] }] })
                        .then(result => {
                            if (result) console.log('found');
                            else {
                                chatroom.create({ members: [req.user._id, user._id] }, (err, res) => { console.log(res); });
                            }
                        })

                    req.flash('contact_succ', 'Contact added!!');
                } else {
                    //console.log('pehle se hi hai!!');
                    req.flash('contact_err', 'contact already added!!');
                }
                res.redirect('/chat');

            }
        })
        .catch(err => {
            Swal.fire({
                title: 'Error!',
                text: err,
                icon: 'error'
            });
            console.log(err);
        });

});
router.post('/user/signup', (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;
    let errors = [],
        success = [];
    users.findOne({ $or: [{ email: email }, { phone: phone }] })
        .then(user => {
            if (user) {
                errors.push({ msg: "account already exists!!" });
                //req.flash('error_msg','account already exists');
                res.render('authenticate', { errors, firstname, lastname, email, phone, password });
            } else {
                const newUser = new users({ firstname, lastname, email, phone, password });

                bcrypt.genSalt(10, (er, salt) => {
                    if (er) throw er;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {

                                crypto.randomBytes(20, (err, buf) => {
                                    const token = buf.toString('hex');
                                    users.findOneAndUpdate({ email: email }, { $set: { verifyToken: token } }, { new: true }, function(err, doc) {
                                        if (err) {
                                            throw err;
                                        }
                                    });

                                    const transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'bhaigupta0018@gmail.com',
                                            pass: 'paras@0018'
                                        }
                                    });

                                    let mailOptions = {
                                        from: '"Baatcheet" bhaigupta0018@gmail.com',
                                        to: email,
                                        subject: 'Welcome To Baatcheet',
                                        text: 'Please click the following link to verify your account: \n\n' +
                                            'http://' + req.headers.host + '/verify/' + token + '\n\n' +
                                            'Once verified you can login to youe account!'
                                    };
                                    transporter.sendMail(mailOptions, err => {
                                        if (err) throw err;
                                        else {
                                            success.push({ msg: "Registered successfully!! A verification mail has been sent to your Email ID. Verify your Account!!" })
                                            res.render('authenticate', { success });
                                        }
                                    });
                                });

                            })
                            .catch(err => console.log(err));
                    });
                });


            }
        })

});
router.get('/verify/:token', (req, res) => {
    users.findOne({ verifyToken: req.params.token })
        .then(user => {
            if (!user) {
                res.send('invalid token or token expired.')
            } else {
                users.findOneAndUpdate({ email: user.email }, { $set: { verified: true } }, { new: true }, function(err, doc) {
                    if (err) {
                        throw err;
                    } else {
                        //res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.type('html')
                        res.send(`<h1>Account Verified.</h1><a style='cursor:pointer' href='http://localhost:3000'><button>Login to Continue</button></a>`);
                        users.updateOne({ _id: doc._id }, { $set: { verifyToken: null } }, function(err, result) {
                            if (err) throw (err);
                        });
                    }
                });
            }
        })
});

router.post('/updatepwd', (req, res) => {
    let { cpassword, npassword } = req.body;
    users.findById(req.user._id)
        .then(user => {
            bcrypt.compare(cpassword, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    bcrypt.genSalt(10, (er, salt) => {
                        if (er) throw er;
                        bcrypt.hash(npassword, salt, (err, hash) => {
                            if (err) throw err;
                            npassword = hash;
                            users.updateOne({ _id: user._id }, { $set: { password: npassword } }, function(err, result) {
                                if (err) throw err;
                                console.log('password updated!');
                                req.logout();
                                req.flash('pwd', "Password changed Successfully!!");
                                res.redirect('/');
                            })
                        });
                    });
                } else {
                    req.flash('pwd', 'Incorrect Password!!')
                    res.redirect('/account');
                    console.log("password dont match!!");
                }
            });
        })
});

router.post('/updateinfo', (req, res) => {
    let { firstname, lastname, email, phone } = req.body;
    users.findById(req.user._id)
        .then(user => {
            users.update({ _id: user._id }, { $set: { firstname: firstname, lastname: lastname, email: email, phone: phone } }, function(err, result) {
                if (err) throw err;
                console.log("info updated");
                res.redirect('/chat');
            })
        });
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login']
}));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/chat');
    });

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        //res.redirect('/chat');
        console.log('reached facebook');
    });

router.post('/user/login', (req, res, next) => {
    let lerrors = [];
    passport.authenticate('local', {
        successRedirect: '/chat',
        failureRedirect: '/',
        failureFlash: true,
        session: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    //console.log(req.user);
    users.updateOne({ _id: req.user._id }, { $set: { "is_active": null } }, function(err, res) {
        if (err) throw err;
        console.log("updated")
    });
    req.logout();
    req.flash('succes', 'You are logged out');
    res.redirect('/');
});

router.get('/forgot', (req, res) => {
    res.render('forgot');
})

router.post('/forgotpwd', (req, res) => {
    const { email } = req.body;
    users.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Account not found');
                res.redirect('/forgot');
            } else {
                crypto.randomBytes(20, (err, buf) => {
                    const token = buf.toString('hex');
                    users.findOneAndUpdate({ email: email }, { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 1800000 } }, { new: true }, function(err, doc) {
                        if (err) {
                            throw err;
                        }
                    });

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'bhaigupta0018@gmail.com',
                            pass: 'paras@0018'
                        }
                    });

                    let mailOptions = {
                        from: '"Baatcheet" bhaigupta0018@gmail.com',
                        to: email,
                        subject: 'Password Recovery Email from Baatcheet',
                        text: 'Please click the following link to recover your passoword: \n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'This token will expire after 30 mins.' + '\n\n' +
                            'If you did not request this, please ignore this email.'
                    };
                    transporter.sendMail(mailOptions, err => {
                        if (err) throw err;
                        else {
                            req.flash('succes', 'A Password Recovery Email has been sent to your email.');
                            res.redirect('/forgot');
                        }
                    });
                });

            }
        })
});
router.get('/reset/:token', (req, res) => {
    users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                res.render('verify', { status: false })
            } else {
                res.render('verify', { status: true, userid: user._id })
            }
        })
});
router.post('/resetpwd/:id', (req, res) => {
    let { password } = req.body;
    let id = req.params.id;
    bcrypt.genSalt(10, (er, salt) => {
        if (er) throw er;
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            users.updateOne({ _id: id }, { $set: { password: password } }, function(err, result) {
                if (err) throw err;
                req.flash('pwd', "Password changed Successfully!!");
                users.updateOne({ _id: id }, { $set: { resetPasswordToken: null, resetPasswordExpires: null } }, function(err, result) {
                    if (err) throw (err);
                });
                res.redirect('/');
            })
        });
    });
})

module.exports = router;