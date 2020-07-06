    var element = document.getElementsByClassName('chats');
    element[0].scrollTop=element[0].scrollHeight;
    var y=document.getElementsByClassName("single-message");
    var x = document.getElementsByClassName("sender-name");
    
    var emoji_main = document.getElementsByClassName("main-emoji");

    for(var a=0;a<emoji_main.length;a++){
        var em=emoji_main[a];
        em.addEventListener('click',openMenu);
        
    }
    var dts=document.getElementsByClassName('dot');
    
    for(var a=0;a<dts.length;a++){
        var dt=dts[a];
        dt.addEventListener('click',openOptions);
    }
    function openOptions(event)
    {   
        var dot=event.target;
        var dots=dot.parentElement.parentElement;
        var menu=dots.lastElementChild;
        $(document).ready(function()
            {
            
                $(menu).slideToggle();
                $('body').click(function(event){    
                    if(!$(event.target).is(dot)) {
                        $(menu).hide();
                    }
    });
                
            }); 
    
    }
    

    function openMenu(event)
    {   
        var emoji=event.target;
        var emp=emoji.parentElement.parentElement;
        var emojiMenu=emp.firstElementChild;
        
        $(document).ready(function()
            {
                $(emojiMenu).slideToggle();
                 $('body').click(function(event){    
                    if(!$(event.target).is(emoji)) {
                        $(emojiMenu).hide();
                    }
    });               

                
            }); 
    
    }
    setTimeout(function()
    {
        var firstToggle = document.getElementsByClassName('emoji-menu')
            $(document).ready(function()
            {
                $(firstToggle).hide();   
            }); 
    },-3000);

    var emoji_image = document.getElementsByClassName("emoji-img");

    for(var a=0;a<emoji_image.length;a++){
        var emg=emoji_image[a];
        emg.addEventListener('click',sticker);
        
    }

function tConv24(time24) {
  var ts = time24;
  var H = +ts.substr(0, 2);
  var h = (H % 12) || 12;
  h = (h < 10)?("0"+h):h; 
  var ampm = H < 12 ? " am" : " pm";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
}

function sticker(event){
    var imageEmoji = event.target;
    var source = imageEmoji.src;
    var sticker_menu = imageEmoji.parentElement.parentElement;
    $(document).ready(function(){
        $(sticker_menu).hide();
    })
    
    var cbox = imageEmoji.parentElement.parentElement.parentElement.parentElement.parentElement;
    var chat = cbox.getElementsByClassName('chat-box');
    
        var d = new Date();
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
        var t= h + ':' + m ;
        t=tConv24(t);
        
        //insert you into sender-name
        var para1 = document.createElement("div");
        para1.className="sender-name";
        var node1 = document.createTextNode("you");
        para1.appendChild(node1);
        
        //insert value of input into chat-content
        var para2 = document.createElement("div");
        para2.className="chat-content";
        var node2 = document.createElement("img");
        node2.className="sticker";
        node2.src = " "+ source + " ";
        para2.appendChild(node2);
        
        var para3 = document.createElement("div");
        para3.className="chat-message";
        para3.appendChild(para1);
        para3.appendChild(para2);
        
        var cross = document.createElement("div");
        cross.className="cross";
        var cross_text = document.createTextNode('x');
        cross.appendChild(cross_text);
        
        var datenew = document.createElement("div");
        datenew.className="chat-date-sticker";
        var datenode = document.createTextNode(t);
        datenew.appendChild(datenode);
        
        var single = document.createElement("div");
        single.className="single-message";
        single.style.backgroundColor="#b9ffb9";
        single.appendChild(para3);
        single.appendChild(datenew);
        single.appendChild(cross);
        
        var brk=document.createElement("br");
        chat[0].appendChild(single);
        chat[0].appendChild(brk);
        
        cbox.scrollTop= cbox.scrollHeight;     
    
        var remMessage = document.getElementsByClassName('single-message');

        for(var i=0;i<remMessage.length;i++){
            var removeMessage = remMessage[i];
            removeMessage.addEventListener('click',remchild);
        }
        
    

    function remchild(event){
        
        var messageRemoved = event.target;
        if(messageRemoved.className == 'cross')
        {
            var messageRemove = messageRemoved.parentElement;
            
            var mrParent = messageRemove.parentElement;
            var remBr = messageRemove.nextSibling;
            mrParent.removeChild(remBr);
            mrParent.removeChild(messageRemove);
            var element = mrParent.parentElement;
            element.scrollTop=element.scrollHeight;
            
        }
            
    }           
    
        
    
    
}
   /* $(document).ready(function(){
        var d=document.getElementsByClassName('dot');
        d=d[0];
            $(d).click(function(){
                var m=document.getElementsByClassName('menu');
                m=m[0];
                $(m).slideToggle();
            }); 
        });
*/
   /* var remMessage = document.getElementsByClassName('single-message');

        for(var i=0;i<remMessage.length;i++){
            var removeMessage = remMessage[i];
            removeMessage.addEventListener('click',remchild);
        }
     */   
    function remchild(event){
        
        var messageRemoved = event;
        //console.log(messageRemoved) 
        
            var messageRemove = messageRemoved.parentElement.parentElement.parentElement;
            var mrParent = messageRemove.parentElement;
            var remBr = messageRemove.nextSibling;
            mrParent.removeChild(remBr);
            mrParent.removeChild(messageRemove);
            var element = mrParent.parentElement;
            element.scrollTop=element.scrollHeight;
    }
    var p=0;
    for(p=0; x[p].innerText!=null;p++)
    {   
        if(x[p].innerText=="you")
        {   
            y[p].style.backgroundColor="#b9ffb9";
        }     
    }

    function timeformat(time){
        var hours = time.getHours();
        var minutes = time.getMinutes();
        if(hours < 12) {if(hours < 10) {hours= "0"+hours }}
        else hours =  ((hours + 24) % 12 || 12)
        if(minutes < 10) minutes = "0"+minutes
        return hours+' : '+minutes;
    }

    function changeChatBox(id){
        //id.style.backgroundColor="gainsboro";
        var x;
        x=id.getElementsByClassName("hidden");
    
        var contact=document.getElementsByClassName("contacts");
        var z=document.getElementsByClassName("sender");
        var chat=document.getElementsByClassName("chats");
        var chatscroll = document.getElementsByClassName('multiple-chat');
        var y=document.getElementsByClassName("hidden-phone");
        document.getElementById('initial').style.display="none";
        for(var i=0;i<y.length;i++)
        {                   
            if(x[0].innerHTML==y[i].innerHTML)
            {
                chat[i].style.display="block";
                chat[i].scrollTop = chat[i].scrollHeight;
                var found=i;
            }
            else{
                chat[i].style.display="none";
            }
        }
        for(var j=0;j<z.length;j++)
        {
            if(x[0].innerHTML==z[j].innerHTML)
            {
                 contact[j+1].style.backgroundColor="gainsboro";
            }
            else{
                contact[j+1].style.backgroundColor="white";
            }
        }
        
        
    }
    
    function inputMessage(k){
        
        var chat = k.parentElement.parentElement.parentElement;
        var tmc=document.getElementsByClassName("inputText");
        var tm=k.value;
        
        var chat_box = chat.firstElementChild;
        chat_box = chat_box.nextSibling;
        
        var d = new Date(),
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
        var t= h + ':' + m;
        t=tConv24(t);
        //insert you into sender-name
        var para1 = document.createElement("div");
        para1.className="sender-name";
        var node1 = document.createTextNode("you");
        para1.appendChild(node1);
        
        //insert value of input into chat-content
        var para2 = document.createElement("div");
        para2.className="chat-content";
        var node2 = document.createTextNode(tm);
        para2.appendChild(node2);
        
        var para3 = document.createElement("div");
        para3.className="chat-message";
        para3.appendChild(para1);
        para3.appendChild(para2);
        
        var cross = document.createElement("div");
        cross.className="cross";
        var cross_text = document.createTextNode('x');
        cross.appendChild(cross_text);
        
        var datenew = document.createElement("div");
        datenew.className="chat-date";
        var datenode = document.createTextNode(t);
        datenew.appendChild(datenode);
        
        var single = document.createElement("div");
        single.className="single-message";
        single.style.backgroundColor="#b9ffb9";
        single.appendChild(para3);
        single.appendChild(datenew);
        single.appendChild(cross);
        
        var brk=document.createElement("br");
        chat_box.appendChild(single);
        chat_box.appendChild(brk);
        
        var remMessage = document.getElementsByClassName('single-message');

        for(var i=0;i<remMessage.length;i++){
            var removeMessage = remMessage[i];
            removeMessage.addEventListener('click',remchild);
        }
        
    

    function remchild(event){
        
        var messageRemoved = event.target;
        if(messageRemoved.className == 'cross')
        {
            var messageRemove = messageRemoved.parentElement;
            
            var mrParent = messageRemove.parentElement;
            var remBr = messageRemove.nextSibling;
            mrParent.removeChild(remBr);
            mrParent.removeChild(messageRemove);
            var element = mrParent.parentElement;
            element.scrollTop=element.scrollHeight;
        }
            
    }           
        //tmc[k].value="";
        updateScroll(chat);
    }

    
    function updateScroll(n){
        var element = document.getElementsByClassName("chats");
        n.scrollTop = n.scrollHeight;
    }
    