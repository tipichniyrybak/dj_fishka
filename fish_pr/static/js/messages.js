function load_mesages_from_room(room_id) {

    console.log('open_room' + room_id);
    currRoomID = room_id;

    $.ajax({
        type: "POST",
        url: "/get_messages_from_room/",
        data:  {
            'room_id': room_id
        },
        type: 'POST',
        success: function(response) {
            console.log('response get_messages_from_room:  ');
            console.log(response);

            messages_html = '<div class="chat__content">'

            response.forEach((chat_item, i) => {
                if (chat_item['is_self']) {
                    messages_html = messages_html + '<div class="chat__item chat__item--responder">';
                } else {
                    messages_html = messages_html + '<div class="chat__item">';
                }


                messages_html = messages_html + '<a href="/pdetail' + chat_item['user_send_id'] + '"><img src="http://fishkadata.s3.amazonaws.com/media/' + chat_item['photo_src'] + '" alt="photo" class="chat__person-avatar"></a>';
                messages_html = messages_html + '<div class="chat__messages">';
                console.log(chat_item['messages']);
                chat_item['messages'].forEach((message, i) => {
                    messages_html = messages_html + '<div class="chat__message">';
                    messages_html = messages_html + '<div class="chat__message-time">' + message['time'] + '</div>';
                    messages_html = messages_html + '<div class="chat__message-content">' + message['content'] + '</div>';
                    messages_html = messages_html + '</div>';
                });
                messages_html = messages_html + '</div>';
                messages_html = messages_html + '</div>';
            });
            messages_html = messages_html + '</div>';

            console.log(messages_html);
            $('#messagesID').html(messages_html);
        },
        error: function(error) {
            console.log('get_messages_from_room_error:');
            console.log(error);
        }
    });

}

function send_message() {
    console.log($('#text_messageID').val());
    $.ajax({
        type: "POST",
        url: "/send_message/",
        data:  {
            'room_id': currRoomID,
            'content': $('#text_messageID').val()
        },
        type: 'POST',
        success: function(response) {
            console.log('response send_message:  ');
            console.log(response);
            if (response == 1) {
                $('#text_messageID').val('');
                load_mesages_from_room(currRoomID);
            }


        },
        error: function(error) {
            console.log('send_message_error:');
            console.log(error);
        }
    });
}
