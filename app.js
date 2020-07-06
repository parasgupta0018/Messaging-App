const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server).sockets;
const mongoose = require("mongoose");
//const mongo = require('mongodb').MongoClient;
const path = require("path");
const route = require('./routes/route');
const dotenv = require('dotenv');
const bodyparser = require("body-parser");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const chatroom = require('./model/chatroom');
const usr = require('./model/usersdetail');
const format = require('./public/js/msgformat');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// Passport Config

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

dotenv.config({ path: './config.env' });

const db = "mongodb+srv://parasgupta0018:paras0018@cluster0-6ygpr.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('database added');
});

require('./passport.js')(passport);

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(function(req, res, next) {
    //res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.succes = req.flash('succes');
    res.locals.pwd = req.flash('pwd');
    res.locals.contact_succ = req.flash('contact_succ');
    res.locals.contact_err = req.flash('contact_err');
    res.locals.img_err = req.flash('img_err');
    next();
});

app.use(route);

connections = [];
io.on("connection", (socket) => {
    //let chat = db.collection("chats");
    let user = app.get('user');
    //console.log(socket.id);
    usr.updateOne({ _id: user }, { $set: { "is_active": socket.id } }, function(err, res) { if (err) throw err; });

    socket.emit('message', format('Bot', 'welcome to baatcheet'));

    connections.push(socket);
    console.log("connected : %s sockets", connections.length);

    usr.findOne({ _id: user })
        .then(user => {
            if (user) {
                socket.emit('getUser', user);
                //console.log("user: "+ user);
                user.contacts.forEach(contact => {
                    usr.findById(contact)
                        .then(cont => {
                            //console.log("status:"+cont.is_active);
                            if (cont.is_active != null) {
                                io.to(cont.is_active).emit('status', { id: user._id });
                            }
                        })
                });
            }
        });


    socket.on('changeRoom', ({ user, contact }) => {
        chatroom.findOne({ $or: [{ members: [user, contact] }, { members: [contact, user] }] })
            .then(chat => {
                //console.log(chat);
                const room = chat._id;

                socket.join(room);
                socket.on('storemsg', (data) => {
                    //storing the message
                    let { msg, usr_id, con_id, usr_phone } = data;
                    //console.log(msg, usr_id, con_id);
                    chatroom.findOneAndUpdate({ $or: [{ members: [usr_id, con_id] }, { members: [con_id, usr_id] }] }, { $push: { messages: { from: usr_id, body: msg } } }, { new: true })
                        .then(result => {
                            //console.log(result.messages.slice(-1)[0]._id);
                            emitmsg(result.messages.slice(-1)[0]._id);
                        })
                        //id of the latest message

                    function emitmsg(msg_id) {
                        //emit to a particular room
                        usr.findOne({ _id: con_id })
                            .then(contact => {
                                io.to(room).emit('message', format(usr_id, contact.phone, msg, usr_phone, msg_id));
                            })
                    }
                });
                socket.on('delete_msg', (msg_id) => {
                    //console.log(msg_id);
                    chatroom.updateOne({ _id: room }, { $pull: { messages: { _id: msg_id.msg_id } } }, { safe: true, multi: true }, function(err, obj) {
                        if (err) throw err;
                    });
                });
            });
    });
    socket.on('rem_cont', (contact_id) => {
        usr.updateOne({ _id: user }, { $pull: { contacts: contact_id.contact_id } }, { safe: true, multi: true }, function(err, obj) {
            if (err) throw err;
            //console.log(contact_id.contact_id);

        })
    });
    socket.on("disconnect", (data) => {
        usr.updateOne({ _id: user }, { $set: { "is_active": null } }, function(err, res) { if (err) throw err; });
        usr.findOne({ _id: user })
            .then(user => {
                if (user) {
                    //console.log("user: "+ user);
                    user.contacts.forEach(contact => {
                        usr.findById(contact)
                            .then(cont => {
                                //console.log("status:"+cont.is_active);
                                if (cont.is_active != null) {
                                    io.to(cont.is_active).emit('status-red', { id: user._id });
                                }
                            })
                    });
                }
            });
        connections.splice(connections.indexOf(socket), 1);
        console.log("disconnected : %s sockets", connections.length);
    });
});


server.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT}`);
})