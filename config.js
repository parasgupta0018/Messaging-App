const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

module.exports = {
    Google: {
        clientID: process.env.GclientID,
        clientSecret: process.env.GclientSecret,
        callbackURL: 'https://https://baatcheet18.herokuapp.com/auth/google/callback'
    },
    Facebook: {
        clientID: '2727673097515291',
        clientSecret: '86ef0732020ec2fdf7f1a2e01286609b',
        callbackURL: 'https://https://baatcheet18.herokuapp.com/auth/facebook/callback'
    }
};