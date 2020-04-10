function add_to_friends(reqst_user_id) {
    console.log('add_to_friends');
    $.ajax({
        type: "POST",
        url: "/add_to_friends/",
        data: {
            'request_user_id': recv_user_id
        },

        success: function(response) {
            console.log('response_add_to_friends:  ');
            console.log(response);

            if (response == 1) {

                $('#messageID').html('Пользователь добавлен в друзья!');
                $('#messageID').bPopup({
                    autoClose: 1000
                });
            }
        },
        error: function(error) {
            console.log('add_to_friends_ERROR:');
            console.log(error);
        }
    });

}


function openTab(cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
}
