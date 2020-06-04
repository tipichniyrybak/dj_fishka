function closeForm(form) {
    switch (form) {
        case 'profile_update':
            $('#formProfileEditID').bPopup().close();
            break;
        case 'place_add':
            $('#formPlaceAddID').bPopup().close();
            break;
        case 'order_add':
            $('#formOrderAddID').bPopup().close();
            break;
        case 'send_message':
            $('#formSendMessageID').bPopup().close();
            break;
        default:

    }
}

let currUserID = 0;
let currPlaceID = null;
let currOrderID = null;
let myYandexMap = null;
let currProfile_json = "";

$(document).ready(function() {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    currUserID = '{{ request.user.id }}';


    console.log('currUserID');
    console.log(currUserID);
    if (currUserID > 0) {

        $.ajax({
            type: 'POST',
            url: '/get_profile_info',
            data: {
                'userID': currUserID
            },
            success: function(response) {
                console.log('Profile_json:  ');
                console.log(response);
                currProfile_json = response;
            } 

        });

        // $('#profile_controlsID').show();
        // $('#login_formID').hide();
        //reloadProfile();

        lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
        });


    } else {
        // $('#profile_controlsID').hide();
        // $('#login_formID').show();
    }

    

});
