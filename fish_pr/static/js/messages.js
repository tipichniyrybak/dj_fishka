function load_mesages_from_room(room_id) {

    console.log('open_room' + room_id);

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
            // if (response.length > 0) {
            //     var value = '';
            //     response.forEach(function(order) {
            //         var key = order['user'] + ' : ' + order['date_begin'];
            //         value = order['id'];
            //         $('#select_orders_listID').append('<option value="' + value + '"> ' + key + ' </option>');
            //     });
            // } else {
            //     $('#orders_place_nameID').html('ИД Базы: ' + currPlaceID + '  <br>Пока нет ни одного отчета. Будьте первым!');
            // }
            messages_html = '<div class="chat__content">'
            response.forEach((chat_item, i) => {


                messages_html = messages_html + '<div class="chat__item">'
                messages_html = messages_html + '<img src="http://placekitten.com/40/50" alt="photo" class="chat__person-avatar">'
                messages_html = messages_html + '<div class="chat__messages">'
                console.log(chat_item['messages']);
                chat_item['messages'].forEach((message, i) => {



                    messages_html = messages_html + '<div class="chat__message">'
                    messages_html = messages_html + '<div class="chat__message-time">9:03</div>'
                    messages_html = messages_html + '<div class="chat__message-content">Hi</div>'
                    messages_html = messages_html + '</div>'
                });
                messages_html = messages_html + '</div>'
                messages_html = messages_html + '</div>'
            });
            messages_html = messages_html + '</div>'

            console.log(messages_html);




            $('#messagesID').html(messages_html);
        },
        error: function(error) {
            console.log('get_messages_from_room_error:');
            console.log(error);
        }
    });

}
