const moment = require('moment');

function formatMessage(sender, cphone, msg, sender_phone,msg_id){
    return {
        sender,
        cphone,
        msg,
        sender_phone,
        msg_id,
        time : moment().format('hh:mm a')
    }
}

module.exports = formatMessage;