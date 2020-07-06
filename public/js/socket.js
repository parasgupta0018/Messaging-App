
var socket = io.connect();
var Current_user = { phone: '' };
function storemsg(msg, usr_id, con_id, usr_phone) {
    msg = (msg.previousElementSibling);
    if (msg.value.trim() != "") {
        socket.emit('storemsg', { msg: msg.value.trim(), usr_id: usr_id, con_id: con_id, usr_phone: usr_phone });
        msg.value = "";
    }
}
function remove_cont(cid){
    //console.log("cid:"+cid);
    socket.emit('rem_cont',{contact_id: cid});
    location.reload();
}
socket.on('status',(id)=>{
    var status = document.getElementsByClassName('status');
    for(var i=0; i<status.length;i++){
        var c_id = status[i].previousElementSibling.previousElementSibling.previousElementSibling;
        console.log(id);
        if(c_id.innerHTML == id.id){
            status[i].style.color = "green";
        }
    }    
})
socket.on('status-red',(id)=>{
    var status = document.getElementsByClassName('status');
    for(var i=0; i<status.length;i++){
        var c_id = status[i].previousElementSibling.previousElementSibling.previousElementSibling;
        console.log(id);
        if(c_id.innerHTML == id.id){
            status[i].style.color = "red";
        }
    }    
})
function changeRoom(usr, contact) {
    socket.emit('changeRoom', { user: usr, contact: contact });
}
socket.on('getUser', (usr) => {
    socket.on('message', (msg) => {
        //console.log(msg);
        disp_message(msg, usr);
    })
});

function removemsg(cross) {
    var msgid = cross.nextElementSibling.innerHTML;
    //console.log(msgid);
    socket.emit('delete_msg', { msg_id: msgid });
}

function disp_message(msg, Current_user) {
    var c = document.getElementsByClassName("hidden-phone");
    //console.log(Current_user.phone + 'message');
    if (Current_user) {
        if (msg.cphone != Current_user.phone) {
            var message_div = document.createElement('div');

            message_div.className = 'single-message';
            message_div.style.justifyContent = 'flex-end';
            message_div.innerHTML = `<div class="chat-message">
                                        <div class="sender-name" id="owner">you</div>
                                        <div class="chat-content"><pre>${msg.msg}</pre></div>
                                    </div>
                                    <div class="chat-date">${msg.time}</div>
                                    <div class="cross" onclick="removemsg(this)">x</div>   
                                    <div class="hide_msg_id">${msg.msg_id}</div>
                                `
            message_div.innerHTML = `<div class="test" style="background-color:#b9ffb9;padding: 8px;border-radius: 10px;min-width: 150px;float: right !important;">
                                        <div class="chat-message row" style="padding: 0px !important;">
                                            <div class="sender-name col-10" id="owner">you</div>
                                            <div class="cross col-2" style="padding: 0px !important;float: right;position: relative;" onclick="removemsg(this);remchild(this);">
                                                <span style="position: absolute;right: 16px;top: -2px;">x</span>
                                            </div>
                                            <div class="hide_msg_id">${msg.msg_id}</div>
                                        </div>   
                                        <div class="chat-content"><pre>${msg.msg}</pre></div>
                                        <div class="chat-date" style="white-space: nowrap; float: right;">${msg.time}</div>
                                    </div>`
            var brk = document.createElement('br');

            for (var i = 0; i < c.length; i++) {
                if (msg.cphone == c[i].innerHTML) {
                    c[i].parentElement.nextElementSibling.appendChild(message_div);
                    c[i].parentElement.nextElementSibling.appendChild(brk);
                    c[i].parentElement.parentElement.scrollTop = c[i].parentElement.parentElement.scrollHeight;
                }
            }
        }
        else if (msg.cphone == Current_user.phone) {
            var message_div = document.createElement('div');

            message_div.className = 'single-message';

            var brk = document.createElement('br');

            for (var i = 0; i < c.length; i++) {
                if (msg.sender_phone == c[i].innerHTML) {
                    //console.log();
                    message_div.innerHTML = `<div class="chat-message">
                                    <div class="sender-name" id="owner">${c[i].nextElementSibling.innerHTML}</div>
                                    <div class="chat-content"><pre>${msg.msg}</pre></div>
                                </div>
                                <div class="chat-date">${msg.time}</div>
                                <div class="cross" onclick="removemsg(this)">x</div>
                                <div class="hide_msg_id">${msg.msg_id}</div>`

                    message_div.innerHTML = `<div class="test" style="background-color:white;padding: 8px;border-radius: 10px;min-width: 150px;float: right !important;">
                                                <div class="chat-message row" style="padding: 0px !important;">
                                                    <div class="sender-name col-10" id="owner">${c[i].nextElementSibling.innerHTML}</div>
                                                    <div class="cros col-2" style="padding: 0px !important;float: right;position: relative;">
                                                        <span style="position: absolute;right: 16px;top: -2px;"></span>
                                                    </div>
                                                    <div class="hide_msg_id">${msg.msg_id}</div>
                                                </div>   
                                                <div class="chat-content"><pre>${msg.msg}</pre></div>
                                                <div class="chat-date" style="white-space: nowrap; float: right;">${msg.time}</div>
                                            </div>`
                    c[i].parentElement.nextElementSibling.appendChild(message_div);
                    c[i].parentElement.nextElementSibling.appendChild(brk);
                    c[i].parentElement.parentElement.scrollTop = c[i].parentElement.parentElement.scrollHeight;
                }
            }
        }
    }
}